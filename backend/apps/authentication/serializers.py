from rest_framework import serializers
from django.contrib.auth.models import User
from apps.authentication.models import UserProfile

class RegisterSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    avatar = serializers.CharField(required=False, allow_blank=True)

    def validate(self, data):
        email_str = data['email'].strip().lower()
        data['email'] = email_str

        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        
        if User.objects.filter(username=email_str).exists() or UserProfile.objects(email=email_str).first():
            raise serializers.ValidationError({"email": "User with this email already exists."})
        
        return data

    def create(self, validated_data):
        email = validated_data['email'].strip().lower()
        full_name = validated_data['full_name'].strip()

        # Create standard Django user in SQLite
        django_user = User.objects.create_user(
            username=email,
            email=email,
            password=validated_data['password'],
            first_name=full_name
        )
        
        # Mandatory MongoEngine profile save in MongoDB Atlas
        mongo_profile = UserProfile.objects(email=email).first()
        if not mongo_profile:
            mongo_profile = UserProfile(
                email=email,
                full_name=full_name,
                bio="New student member of SkillXchange community.",
                credits=1,
                rating_avg=5.0,
                points=100,
                avatar=validated_data.get('avatar', "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"),
                role="User",
                is_verified=True
            )
            mongo_profile.save()
        
        return django_user

class UserProfileSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    email = serializers.EmailField(read_only=True)
    full_name = serializers.CharField(max_length=150)
    bio = serializers.CharField(max_length=1000, required=False, allow_blank=True)
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    major = serializers.CharField(max_length=100, required=False, allow_blank=True)
    teach_skills = serializers.ListField(child=serializers.CharField(), required=False)
    learn_skills = serializers.ListField(child=serializers.CharField(), required=False)
    rating_avg = serializers.FloatField(read_only=True)
    points = serializers.IntegerField(read_only=True)
    avatar = serializers.CharField(required=False, allow_blank=True)
    role = serializers.CharField(read_only=True)
    is_verified = serializers.BooleanField(read_only=True)
