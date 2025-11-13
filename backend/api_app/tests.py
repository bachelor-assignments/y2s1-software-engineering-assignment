from django.test import TestCase, Client
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework import status


class AssetCrudTests(TestCase):
    def set_up(self):
        self.client = Client()

        self.client.post(
            "/api/auth/token/", {"username": "admin", "password": "adminpassword"}
        )

    def test_create_asset(self):
        res = self.client.post(
            "/api/asset",
            {
                "file": SimpleUploadedFile(
                    "test_asset.jpg", b"123", content_type="image/jpeg"
                ),
                "title": "test_asset_1",
                "metadata": {"purpose": "testing", "type": "asset"},
            },
        )
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
