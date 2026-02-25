import json

from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase

from .models import PortfolioProfile, Publication


class PublicationsAPITests(APITestCase):
    def setUp(self):
        self.owner = User.objects.create_user(
            username="owner",
            email="owner@example.com",
            password="ValidPass123!",
        )
        self.other_user = User.objects.create_user(
            username="other",
            email="other@example.com",
            password="ValidPass123!",
        )

    def _authenticate(self, user):
        token, _ = Token.objects.get_or_create(user=user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {token.key}")

    def test_create_publication_requires_authentication(self):
        response = self.client.post(
            "/publications/create/",
            {"name": "Test", "description": "Description"},
            format="multipart",
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_authenticated_user_can_create_publication(self):
        self._authenticate(self.owner)
        response = self.client.post(
            "/publications/create/",
            {
                "name": "Project A",
                "description": "Project description",
                "role": "Lead Developer",
                "technologies": json.dumps(["Django", "React"]),
                "media_links": json.dumps(["https://example.com/demo"]),
            },
            format="multipart",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Publication.objects.filter(user=self.owner).count(), 1)
        self.assertEqual(response.data["role"], "Lead Developer")
        self.assertEqual(response.data["technologies"], ["Django", "React"])

    def test_mine_endpoint_returns_only_owner_publications(self):
        Publication.objects.create(
            name="Mine",
            description="Mine description",
            user=self.owner,
        )
        Publication.objects.create(
            name="Other",
            description="Other description",
            user=self.other_user,
        )
        self._authenticate(self.owner)

        response = self.client.get("/publications/mine/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["name"], "Mine")

    def test_public_user_listing_is_accessible(self):
        Publication.objects.create(
            name="Public Project",
            description="Visible to all",
            user=self.owner,
        )

        response = self.client.get(f"/publications/user/{self.owner.id}/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_detail_endpoint_blocks_non_owner(self):
        publication = Publication.objects.create(
            name="Private Project",
            description="Owner only edits",
            user=self.owner,
        )
        self._authenticate(self.other_user)

        response = self.client.get(f"/publications/{publication.id}/")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_profile_mine_returns_or_creates_profile(self):
        self._authenticate(self.owner)

        response = self.client.get("/publications/profile/mine/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], "owner")
        self.assertTrue(PortfolioProfile.objects.filter(user=self.owner).exists())

    def test_profile_patch_updates_structured_sections(self):
        self._authenticate(self.owner)
        payload = {
            "full_name": "Owner Name",
            "summary": "Product-focused engineer.",
            "work_experience": [
                {
                    "job_title": "Engineer",
                    "company": "Acme",
                    "duration": "2023-2025",
                    "responsibilities": "Built scalable APIs",
                }
            ],
            "education": [
                {
                    "degree": "BSc Computer Science",
                    "institution": "State University",
                    "graduation_date": "2023",
                }
            ],
            "technical_skills": ["Django", "React"],
            "soft_skills": ["Communication"],
            "hobbies": ["Photography", "Cycling"],
        }

        response = self.client.patch(
            "/publications/profile/mine/",
            payload,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["full_name"], "Owner Name")
        self.assertEqual(response.data["technical_skills"], ["Django", "React"])
        self.assertEqual(response.data["hobbies"], ["Photography", "Cycling"])

    def test_public_profile_endpoint_is_accessible(self):
        profile = PortfolioProfile.objects.create(
            user=self.owner,
            full_name="Owner Name",
            summary="Public profile summary",
            hobbies=["Reading"],
        )

        response = self.client.get(f"/publications/profile/user/{self.owner.id}/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["full_name"], profile.full_name)
        self.assertEqual(response.data["hobbies"], ["Reading"])
