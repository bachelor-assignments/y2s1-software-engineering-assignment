import uuid
from api_app.models import Asset
from api_app.permissions import RoleCrudPermission
from api_app.serializers import AssetSerializer, FileSerializer
from api_app.services import file_service
from django.core.files.uploadedfile import UploadedFile
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from typing import Any, cast


class AssetView(APIView):
    permission_classes = [RoleCrudPermission]

    def post(self, request: Request):
        file_serializer = FileSerializer(data=request.data)
        file_serializer.is_valid(raise_exception=True)
        validated_data = cast(dict[str, Any], file_serializer.validated_data)
        uploaded_file = cast(UploadedFile, validated_data.get("file"))

        filename = f"{uuid.uuid4()}_{uploaded_file.name}"
        file_url = file_service.upload_file_to_minio(uploaded_file, filename)

        asset_serializer = AssetSerializer(data=request.data, action="post")
        asset_serializer.is_valid(raise_exception=True)

        asset = cast(
            Asset, asset_serializer.save(asset_url=file_url, owner=request.user)
        )

        return Response(
            {
                "file_url": asset.asset_url,
            },
            status=status.HTTP_201_CREATED,
        )

    def put(self, request: Request, asset_id=None):
        return Response("todo", status=status.HTTP_200_OK)

    def delete(self, request: Request, asset_id=None):
        return Response("todo", status=status.HTTP_200_OK)


class AssetListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request):
        return Response("todo", status=status.HTTP_200_OK)


class AssetVersionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request, asset_id=None):
        return Response("todo", status=status.HTTP_200_OK)
