from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from apps.accounts.models import User

class AuthenticationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="testuser@example.com",
            password="securepassword123",
            name="Test User",
            role=User.Role.GUEST
        )

    def test_user_registration(self):
        response = self.client.post('/api/auth/register/', {
            'email': 'newuser@example.com',
            'password': 'password123',
            'name': 'New User',
            'role': 'GUEST'
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('access', response.data)
        self.assertIn('user', response.data)

    def test_user_login(self):
        response = self.client.post('/api/auth/login/', {
            'email': 'testuser@example.com',
            'password': 'securepassword123'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)

    def test_invalid_login(self):
        response = self.client.post('/api/auth/login/', {
            'email': 'testuser@example.com',
            'password': 'wrongpassword'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_me_authenticated_user(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/auth/me/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], 'testuser@example.com')
