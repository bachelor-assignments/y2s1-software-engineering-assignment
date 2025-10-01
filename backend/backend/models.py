from django.db import models

class Asset(models.Model):
    asset_url = models.CharField(max_length=100, primary_key=True, null=False)
    title = models.CharField(max_length=100, unique=True, null=False)
    metadata = models.JSONField(null=False)
    created_at = models.DateTimeField(auto_now_add=True, null=False)
    owner = models.ForeignKey("User", on_delete=models.CASCADE, null=False)


class AssetLog(models.Model):
    id = models.AutoField(primary_key=True, null=False)
    title = models.CharField(max_length=100, unique=True, null=False)
    metadata = models.JSONField(null=False)
    updated_at = models.DateTimeField(auto_now=True, null=False), 
    asset_url = models.ForeignKey(Asset, on_delete=models.CASCADE, null=False)
    updated_by = models.ForeignKey('User', on_delete=models.CASCADE, null=False)


class User(models.Model):
    id = models.AutoField(primary_key=True, null=False)
    username = models.CharField(max_length=100, unique=True, null=False)
    password = models.CharField(max_length=100, null=False)
    created_at = models.DateTimeField(auto_now_add=True, null=False)
    role_id = models.ForeignKey('Role', on_delete=models.CASCADE, null=False)


class Role(models.Model):
    id = models.AutoField(primary_key=True, null=False)
    name = models.CharField(max_length=100, unique=True, null=False)
    description = models.TextField(null=False)
