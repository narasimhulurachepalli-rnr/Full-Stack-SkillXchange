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
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            profile = UserProfile.objects(email=user.email).first()
            return Response({
                "message": "User registered successfully.",
                "tokens": {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                },
                "user": profile.to_json_dict() if profile else None
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = UserProfile.objects(email=request.user.email).first()
        if not profile:
            return Response({"error": "Profile not found."}, status=status.HTTP_404_NOT_FOUND)
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
