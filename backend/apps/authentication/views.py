from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from apps.authentication.models import UserProfile
from apps.authentication.serializers import RegisterSerializer, UserProfileSerializer
from django.contrib.auth.models import User

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = serializer.save()
                refresh = RefreshToken.for_user(user)
                
                # Fetch created MongoEngine document from MongoDB Atlas
                profile = UserProfile.objects(email=user.email).first()
                if not profile:
                    profile = UserProfile(
                        email=user.email,
                        full_name=user.first_name,
                        bio="New student member of SkillXchange community.",
                        credits=1,
                        rating_avg=5.0,
                        points=100,
                        avatar=request.data.get('avatar', "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"),
                        role="User",
                        is_verified=True
                    )
                    profile.save()

                return Response({
                    "message": "User registered successfully.",
                    "tokens": {
                        "refresh": str(refresh),
                        "access": str(refresh.access_token),
                    },
                    "user": profile.to_json_dict()
                }, status=status.HTTP_201_CREATED)
            except Exception as e:
                print(f">>> Registration Exception: {e}")
                return Response(
                    {"detail": f"Registration failed to store profile in MongoDB Atlas: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = None
        try:
            profile = UserProfile.objects(email=request.user.email).first()
        except Exception:
            pass

        if not profile:
            # Auto-create UserProfile document if user exists in SQLite but missing in MongoDB Atlas
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
            except Exception as e:
                return Response({"error": f"Profile not found and creation failed: {e}"}, status=status.HTTP_404_NOT_FOUND)

        return Response(profile.to_json_dict(), status=status.HTTP_200_OK)

    def put(self, request):
        profile = UserProfile.objects(email=request.user.email).first()
        if not profile:
            return Response({"error": "Profile not found."}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = UserProfileSerializer(data=request.data)
        if serializer.is_valid():
            # Update fields in MongoEngine document
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
            
            # Also update name in SQLite Django User model
            request.user.first_name = profile.full_name
            request.user.save()
            
            return Response(profile.to_json_dict(), status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
