import os
import django
from django.test import TestCase
from django.contrib.auth.models import User
from apps.authentication.models import UserProfile
from rest_framework.test import APIClient
from rest_framework import status

class AuthenticationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = '/api/auth/register/'
        self.login_url = '/api/auth/login/'
        self.profile_url = '/api/auth/profile/'
        
        self.test_email = 'testuser@mits.ac.in'
        self.test_password = 'TestPassword123!'
        self.test_name = 'Test User'

        UserProfile.objects(email=self.test_email).delete()
        User.objects.filter(username=self.test_email).delete()

    def test_registration_and_login_flow(self):
        # 1. Register User
        payload = {
            'full_name': self.test_name,
            'email': self.test_email,
            'password': self.test_password,
            'confirm_password': self.test_password
        }
        response = self.client.post(self.register_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('tokens', response.data)
        
        # Verify MongoEngine document created
        profile = UserProfile.objects(email=self.test_email).first()
        self.assertIsNotNone(profile)
        self.assertEqual(profile.full_name, self.test_name)

        # 2. Login User
        login_payload = {
            'username': self.test_email,
            'password': self.test_password
        }
        login_response = self.client.post(self.login_url, login_payload, format='json')
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        self.assertIn('access', login_response.data)
        
        # 3. Access Protected Profile
        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        profile_response = self.client.get(self.profile_url)
        self.assertEqual(profile_response.status_code, status.HTTP_200_OK)
        self.assertEqual(profile_response.data['email'], self.test_email)
