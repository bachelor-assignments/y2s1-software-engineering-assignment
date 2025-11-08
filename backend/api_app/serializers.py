from rest_framework import serializers
from .models import Asset, User, AssetLog
from api_app.services import file_service


class FileSerializer(serializers.Serializer):
    file = serializers.FileField(required=True)


class PaginationSerializer(serializers.Serializer):
    page_size = serializers.IntegerField(
        min_value=1, max_value=20, required=False, default=20
    )
    page_index = serializers.IntegerField(min_value=0, required=False, default=0)


class AssetSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)  # <-- optional, ensure frontend uses id
    asset_url = serializers.SerializerMethodField()
    owner = serializers.CharField(source="owner.username", read_only=True)
    metadata = serializers.JSONField(required=False) 


    class Meta:
        model = Asset
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        # `action` passed from view
        action = kwargs.pop("action", "default")
        super().__init__(*args, **kwargs)

        self.fields["updated_at"].read_only = True

        if action == "get":
            self.fields["file_name"].required = False
            self.fields["title"].required = False
            self.fields["metadata"].required = False
            self.fields["owner"].required = False
        elif action == "post":
            self.fields["file_name"].read_only = True
            self.fields["metadata"].required = False
            self.fields["owner"].read_only = True
            self.fields["metadata"].required = False
            self.fields["title"].required = True
        elif action == "put":
            self.fields["file_name"].read_only = True

    def get_asset_url(self, obj):
        return file_service.get_file_url(obj.file_name)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password", "role", "created_at"]

    def __init__(self, *args, **kwargs):
        action = kwargs.pop("action", "default")
        super().__init__(*args, **kwargs)

        self.fields["created_at"].read_only = True
        self.fields["id"].read_only = True

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        user = self.Meta.model(**validated_data)
        user.is_active = True  # ensure user can login
        if password:
            user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


class AssetLogSerializer(serializers.ModelSerializer):
    updated_by = serializers.CharField(source="updated_by.username", read_only=True)

    class Meta:
        model = AssetLog
        fields = ["id", "title", "metadata", "updated_at", "updated_by"]
