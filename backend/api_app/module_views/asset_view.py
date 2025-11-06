import uuid
import json
from api_app.models import Asset, AssetLog
from api_app.permissions import RoleCrudPermission
from api_app.serializers import AssetSerializer, FileSerializer, PaginationSerializer
from api_app.services import file_service
from django.core.files.uploadedfile import UploadedFile
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from typing import Any, cast
from rest_framework.parsers import MultiPartParser, FormParser


class AssetView(APIView):
    permission_classes = [RoleCrudPermission]
    parser_classes = [MultiPartParser, FormParser]

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
            Asset, asset_serializer.save(file_name=filename, owner=request.user)
        )

        return Response(
            {"file_url": file_url},
            status=status.HTTP_201_CREATED,
        )

    def put(self, request: Request, asset_filename=None):
        try:
            asset = Asset.objects.get(file_name=asset_filename)
        except Asset.DoesNotExist:
            return Response("Asset does not exist.", status=status.HTTP_404_NOT_FOUND)

        if request.user != asset.owner:
            return Response(
                "You are not allowed to modify this asset, only the owner can modify.",
                status=status.HTTP_403_FORBIDDEN,
            )

        AssetLog.objects.create(
            title=asset.title,
            metadata=asset.metadata,
            asset=asset,
            owner=asset.owner,
            updated_by=request.user,
        )

        asset_serializer = AssetSerializer(
            instance=asset, data=request.data, action="put"
        )
        asset_serializer.is_valid(raise_exception=True)
        asset_serializer.save()

        return Response(asset_serializer.data, status=status.HTTP_200_OK)

    def delete(self, request: Request, asset_filename=None):
        try:
            asset = Asset.objects.get(file_name=asset_filename)
        except Asset.DoesNotExist:
            return Response("Asset does not exist.", status=status.HTTP_404_NOT_FOUND)

        if request.user.role != "admin" and request.user != asset.owner:
            return Response(
                "You are not allowed to delete this asset. Only the owner or an admin can delete.",
                status=status.HTTP_403_FORBIDDEN,
            )
        asset.delete()
        return Response(status=status.HTTP_200_OK)


class AssetListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request):
        pagination_serializer = PaginationSerializer(data=request.query_params)
        pagination_serializer.is_valid(raise_exception=True)

        page_index = pagination_serializer.validated_data["page_index"]
        page_size = pagination_serializer.validated_data["page_size"]
        offset = page_index * page_size
        limit = page_size

        filter_title = request.query_params.get("title", "").strip()
        filter_metadata = request.query_params.get("metadata", "").strip()
        assets = Asset.objects.all()

        if filter_title:
            assets = assets.filter(title__icontains=filter_title)
        if filter_metadata:
            try:
                metadata_dict = json.loads(filter_metadata)

                for key, value in metadata_dict.items():
                    assets = assets.filter(**{f"metadata__{key}": value})

            except json.JSONDecodeError:
                return Response(
                    {"error": "Invalid metadata JSON format"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        assets = assets[offset : offset + limit]
        serializer: list[Asset] = AssetSerializer(assets, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AssetVersionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request, asset_filename=None):
        try:
            asset = Asset.objects.get(file_name=asset_filename)
        except Asset.DoesNotExist:
            return Response("Asset not found", status=status.HTTP_404_NOT_FOUND)

        logs = AssetLog.objects.filter(asset=asset).order_by("-updated_at")
        data = [
            {
                "id": log.id,
                "title": log.title,
                "metadata": log.metadata,
                "updated_at": log.updated_at,
                "updated_by": log.updated_by.username,
            }
            for log in logs
        ]
        return Response(data, status=status.HTTP_200_OK)
