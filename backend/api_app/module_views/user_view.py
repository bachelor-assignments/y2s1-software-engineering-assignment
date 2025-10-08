from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from api_app.models import User
from ..serializers import UserSerializer


class UserView(APIView):
    def post(self, request: Request):
        return Response("todo", status=status.HTTP_200_OK)

    def put(self, request: Request, user_id=None):
        return Response("todo", status=status.HTTP_200_OK)

    def delete(self, request: Request, user_id=None):
        return Response("todo", status=status.HTTP_200_OK)


class UserListView(APIView):
    def get(self, request: Request):
        return Response("todo", status=status.HTTP_200_OK)


class UserRolesView(APIView):
    # TODO: auth permission required
    def get(self, request: Request):
        roles = [{"id": value, "name": label} for value, label in User.ROLE_CHOICES]
        return Response(roles, status=status.HTTP_200_OK)
