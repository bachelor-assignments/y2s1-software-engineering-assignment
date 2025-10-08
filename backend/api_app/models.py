from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_CHOICES = [
        ("admin", "Admin"),
        ("editor", "Editor"),
        ("viewer", "Viewer"),
    ]

    id = models.AutoField(primary_key=True)
    created_at = models.DateTimeField(auto_now_add=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="viewer")

    def __str__(self):
        return f"{self.username} ({self.role})"


class Asset(models.Model):
    asset_url = models.CharField(max_length=100, primary_key=True)
    title = models.CharField(max_length=100, unique=True)
    metadata = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.title


class AssetLog(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=100, unique=True)
    metadata = models.JSONField()
    updated_at = models.DateTimeField(auto_now=True)
    asset_url = models.ForeignKey(Asset, on_delete=models.CASCADE)
    updated_by = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.title
