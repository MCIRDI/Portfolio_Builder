from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase


class AccountsAPITests(APITestCase):
    def test_register_creates_user_and_token(self):
        payload = {
            "username": "alice",
            "email": "alice@example.com",
            "password": "ValidPass123!",
        }

        response = self.client.post("/accounts/register/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("token", response.data)
        self.assertTrue(User.objects.filter(username="alice").exists())

    def test_login_returns_token_and_user_data(self):
        User.objects.create_user(
            username="bob",
            email="bob@example.com",
            password="ValidPass123!",
        )

        response = self.client.post(
            "/accounts/login/",
            {"email": "bob@example.com", "password": "ValidPass123!"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("token", response.data)
        self.assertEqual(response.data["user"]["username"], "bob")

    def test_current_user_requires_authentication(self):
        response = self.client.get("/accounts/user/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_current_user_returns_authenticated_profile(self):
        user = User.objects.create_user(
            username="charlie",
            email="charlie@example.com",
            password="ValidPass123!",
        )
        token = Token.objects.create(user=user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {token.key}")

        response = self.client.get("/accounts/user/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], "charlie")

    def test_public_user_endpoint_returns_non_sensitive_fields(self):
        user = User.objects.create_user(
            username="daisy",
            email="daisy@example.com",
            password="ValidPass123!",
        )

        response = self.client.get(f"/accounts/public/{user.id}/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], "daisy")
        self.assertNotIn("email", response.data)
