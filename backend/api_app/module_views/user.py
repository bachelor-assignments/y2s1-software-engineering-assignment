from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from api_app.models import Role
from ..serializers import RoleSerializer


class User(APIView):
    def post(self, request: Request):
        return Response("todo", status=status.HTTP_200_OK)

    def put(self, request: Request, user_id=None):
        return Response("todo", status=status.HTTP_200_OK)

    def delete(self, request: Request, user_id=None):
        return Response("todo", status=status.HTTP_200_OK)


class UserList(APIView):
    def get(self, request: Request):
        return Response("todo", status=status.HTTP_200_OK)


class UserRoles(APIView):
    # TODO: auth permission required
    def get(self, request: Request):
        role_list = Role.objects.all()
        serializer = RoleSerializer(role_list, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
