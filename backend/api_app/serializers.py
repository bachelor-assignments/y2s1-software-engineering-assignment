from rest_framework import serializers
from .models import Asset, User


class FileSerializer(serializers.Serializer):
    file = serializers.FileField(required=True)


class PaginationSerializer(serializers.Serializer):
    page_size = serializers.IntegerField(
        min_value=1, max_value=20, required=False, default=20
    )
    page_index = serializers.IntegerField(min_value=0, required=False, default=0)


class AssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asset
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        # `action` passed from view
        action = kwargs.pop("action", "default")
        super().__init__(*args, **kwargs)

        self.fields["updated_at"].read_only = True

        if action == "get":
            self.fields["asset_url"].required = False
            self.fields["title"].required = False
            self.fields["metadata"].required = False
            self.fields["owner"].required = False
        elif action == "post":
            self.fields["asset_url"].read_only = True
            self.fields["metadata"].required = False
            self.fields["owner"].read_only = True
        elif action == "put":
            self.fields["asset_url"].read_only = True


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"
