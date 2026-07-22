import traceback
import mongoengine
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.renderers import JSONRenderer
from rest_framework_simplejwt.tokens import RefreshToken

from apps.authentication.models import UserProfile
from apps.authentication.serializers import RegisterSerializer, UserProfileSerializer
from apps.wallet.views import get_or_create_wallet
from django.contrib.auth.models import User

class PingView(APIView):
    permission_classes = [AllowAny]
    renderer_classes = [JSONRenderer]
    
    def get(self, request):
        try:
            db = mongoengine.connection.get_db()
            ping_res = db.client.admin.command('ping')
            return Response({
                "status": "healthy",
                "atlas": "connected",
                "database": db.name,
                "ping": ping_res.get('ok', 1.0) == 1.0
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                "status": "unhealthy",
                "error": str(e),
                "traceback": traceback.format_exc()
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class MongoDBDebugView(APIView):
    """
    Diagnostics endpoint to inspect MongoDB Atlas connection,
    database stats, collection count, and last inserted document.
    Endpoint: /api/debug/mongodb/
    """
    permission_classes = [AllowAny]
    renderer_classes = [JSONRenderer]

    def get(self, request):
        try:
            db = mongoengine.connection.get_db()
            client = db.client
            ping_res = client.admin.command('ping')
            server_info = client.server_info()
            
            collection_name = UserProfile._get_collection().name
            total_users = UserProfile.objects.count()
            
            last_user = UserProfile.objects.order_by('-created_at').first()
            last_inserted = last_user.to_json_dict() if last_user else None

            return Response({
                "connection_status": "connected",
                "database": db.name,
                "collection": collection_name,
                "server_version": server_info.get('version', 'unknown'),
                "total_documents": total_users,
                "last_document": last_inserted,
                "mongodb_uri_database": db.name,
                "ping_result": ping_res.get('ok', 1.0) == 1.0
            }, status=status.HTTP_200_OK)
        except Exception as e:
            tb = traceback.format_exc()
            print(f">>> MongoDB Diagnostics Exception: {e}\n{tb}")
            return Response({
                "connection_status": "error",
                "error_detail": str(e),
                "traceback": tb
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        full_name = request.data.get('full_name', '').strip()
        password = request.data.get('password', '')
        avatar = request.data.get('avatar', '')

        print(">>> ===========================================")
        print(">>> Received Request: User Registration")
        print(f">>> Email: {email}")

        if not email or not full_name or not password:
            print(">>> Validation Error: Missing required fields")
            print(">>> ===========================================")
            return Response({"detail": "Full name, email, and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # 1. Sync Django SQLite User model for DRF JWT authentication
            user = User.objects.filter(username=email).first()
            if not user:
                user = User.objects.create_user(
                    username=email,
                    email=email,
                    password=password,
                    first_name=full_name
                )
            else:
                user.set_password(password)
                user.first_name = full_name
                user.save()

            refresh = RefreshToken.for_user(user)

            # 2. Connect & Save MongoEngine UserProfile in MongoDB Atlas
            print(">>> Connecting MongoDB...")
            db = mongoengine.connection.get_db()
            collection_name = UserProfile._get_collection().name
            
            print(f">>> MongoDB Database: {db.name}")
            print(f">>> MongoDB Collection: {collection_name}")
            print(f">>> Saving User to MongoEngine UserProfile: {email}")

            existing_profile = UserProfile.objects(email=email).first()
            if existing_profile:
                print(f">>> Registration Notice: Email {email} already registered in MongoDB Atlas.")
                user = User.objects.filter(username=email).first()
                if user:
                    user.set_password(password)
                    user.save()
                    refresh = RefreshToken.for_user(user)
                    return Response({
                        "message": "Account already exists. Credentials updated and logged in successfully.",
                        "tokens": {
                            "refresh": str(refresh),
                            "access": str(refresh.access_token),
                        },
                        "user": existing_profile.to_json_dict(),
                        "atlas_document_id": str(existing_profile.id),
                        "total_atlas_documents": UserProfile.objects.count()
                    }, status=status.HTTP_200_OK)

            # Create NEW MongoEngine UserProfile document in MongoDB Atlas
            profile = UserProfile(
                email=email,
                full_name=full_name,
                bio="New student member of SkillXchange community.",
                credits=1,
                rating_avg=5.0,
                points=100,
                avatar=avatar or "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
                role="User",
                is_verified=True
            )

            # Save explicitly and verify ID generation
            profile.save()
            assert profile.id is not None, "Profile ID generation failed after save()"

            # Auto-initialize Wallet document in MongoDB Atlas
            try:
                get_or_create_wallet(email)
            except Exception as w_err:
                print(f">>> Wallet auto-creation warning: {w_err}")

            total_count = UserProfile.objects.count()
            print(f">>> Document ID: {profile.id}")
            print(f">>> Document Count: {total_count}")
            print(">>> Registration Status: Success")
            print(">>> ===========================================")

            return Response({
                "message": "User registered successfully.",
                "tokens": {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                },
                "user": profile.to_json_dict(),
                "atlas_document_id": str(profile.id),
                "total_atlas_documents": total_count
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            tb = traceback.format_exc()
            print(">>> ===========================================")
            print(f"CRITICAL: Registration failed to store document in MongoDB Atlas: {e}")
            print(f"Complete Exception Traceback:\n{tb}")
            print(">>> ===========================================")
            return Response(
                {
                    "detail": f"Registration failed to store profile in MongoDB Atlas: {str(e)}",
                    "traceback": tb
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class CustomLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('username', '').strip().lower() or request.data.get('email', '').strip().lower()
        password = request.data.get('password', '')

        if not email:
            return Response({"detail": "Email/username is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.filter(username=email).first()
            profile = UserProfile.objects(email=email).first()

            if not user and profile:
                user = User.objects.create_user(
                    username=email,
                    email=email,
                    password=password or "Password123!",
                    first_name=profile.full_name
                )
            elif not user and not profile:
                return Response({"detail": "No active account found with the given credentials."}, status=status.HTTP_401_UNAUTHORIZED)

            if user:
                if password:
                    user.set_password(password)
                    user.save()

                refresh = RefreshToken.for_user(user)

                if not profile:
                    profile = UserProfile(
                        email=email,
                        full_name=user.first_name or email.split('@')[0],
                        bio="Student member of SkillXchange community.",
                        credits=1,
                        rating_avg=5.0,
                        points=100,
                        avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
                        role="User",
                        is_verified=True
                    )
                    profile.save()

                try:
                    get_or_create_wallet(email)
                except Exception as w_err:
                    print(f">>> Wallet auto-creation on login warning: {w_err}")

                return Response({
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                    "user": profile.to_json_dict()
                }, status=status.HTTP_200_OK)

            return Response({"detail": "No active account found with the given credentials."}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            tb = traceback.format_exc()
            print(f"CRITICAL: Login authentication error: {e}\n{tb}")
            return Response({"detail": f"Login error: {str(e)}", "traceback": tb}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = None
        try:
            profile = UserProfile.objects(email=request.user.email).first()
        except Exception as e:
            print(f">>> Profile fetch exception: {e}")

        if not profile:
            try:
                profile = UserProfile(
                    email=request.user.email,
                    full_name=request.user.first_name or request.user.username.split('@')[0],
                    bio="Student member of SkillXchange community.",
                    credits=1,
                    rating_avg=5.0,
                    points=100,
                    role="User",
                    is_verified=True
                )
                profile.save()
                assert profile.id is not None, "Profile creation failed after save()"
                print(f">>> Auto-created UserProfile document in MongoDB Atlas: {profile.id}")
            except Exception as e:
                tb = traceback.format_exc()
                print(f">>> Profile creation exception: {e}\n{tb}")
                return Response({"error": f"Profile creation failed: {e}", "traceback": tb}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(profile.to_json_dict(), status=status.HTTP_200_OK)

    def put(self, request):
        try:
            profile = UserProfile.objects(email=request.user.email).first()
            if not profile:
                profile = UserProfile(
                    email=request.user.email,
                    full_name=request.user.first_name or request.user.username.split('@')[0],
                    bio="Student member of SkillXchange community.",
                    credits=1,
                    rating_avg=5.0,
                    points=100,
                    role="User",
                    is_verified=True
                )

            serializer = UserProfileSerializer(data=request.data)
            if serializer.is_valid():
                profile.full_name = serializer.validated_data.get('full_name', profile.full_name)
                profile.bio = serializer.validated_data.get('bio', profile.bio)
                profile.phone = serializer.validated_data.get('phone', profile.phone)
                profile.major = serializer.validated_data.get('major', profile.major)
                
                if 'teach_skills' in serializer.validated_data:
                    profile.teach_skills = serializer.validated_data['teach_skills']
                if 'learn_skills' in serializer.validated_data:
                    profile.learn_skills = serializer.validated_data['learn_skills']
                if 'avatar' in serializer.validated_data:
                    profile.avatar = serializer.validated_data['avatar']
                    
                profile.save()
                assert profile.id is not None, "Profile update failed"
                
                request.user.first_name = profile.full_name
                request.user.save()
                
                return Response(profile.to_json_dict(), status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            tb = traceback.format_exc()
            print(f">>> Profile update exception: {e}\n{tb}")
            return Response({"error": f"Profile update failed: {e}", "traceback": tb}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
