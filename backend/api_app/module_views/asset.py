from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status


class Asset(APIView):
    def post(self, request: Request):
        return Response("todo", status=status.HTTP_200_OK)

    def put(self, request: Request, asset_id=None):
        return Response("todo", status=status.HTTP_200_OK)

    def delete(self, request: Request, asset_id=None):
        return Response("todo", status=status.HTTP_200_OK)


class AssetList(APIView):
    def get(self, request: Request):
        return Response("todo", status=status.HTTP_200_OK)


class AssetVersion(APIView):
    def get(self, request: Request, asset_id=None):
        return Response("todo", status=status.HTTP_200_OK)
