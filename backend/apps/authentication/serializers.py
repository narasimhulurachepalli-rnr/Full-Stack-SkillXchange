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
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        
        if User.objects.filter(username=data['email']).exists():
            raise serializers.ValidationError({"email": "User with this email already exists."})
        
        return data

    def create(self, validated_data):
        # Create standard Django user in SQLite
        django_user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['full_name']
        )
        
        # Create corresponding MongoEngine profile in MongoDB
        try:
            mongo_profile = UserProfile(
                email=validated_data['email'],
                full_name=validated_data['full_name'],
                avatar=validated_data.get('avatar', '')
            )
            mongo_profile.save()
        except Exception as e:
            print(f">>> MongoEngine profile save notice: {e}")
        
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
