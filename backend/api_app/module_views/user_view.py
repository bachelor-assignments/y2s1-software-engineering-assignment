from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from api_app.models import User
from api_app.permissions import IsAdminPermission
from api_app.serializers import UserSerializer


class UserView(APIView):
    permission_classes = [IsAdminPermission]
    """Uses UserSerializer to validate and save data(if wrong just delete)"""
    def post(self, request: Request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request: Request, user_id=None):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response("User does not exist.", status=status.HTTP_404_NOT_FOUND)

        user_serializer = UserSerializer(
            instance=user, data=request.data, action="put"
        )
        user_serializer.is_valid(raise_exception=True)

        user_serializer.save()
        return Response(user_serializer.data, status=status.HTTP_200_OK)

    def delete(self, request: Request, user_id=None):
        return Response("todo", status=status.HTTP_200_OK)


class UserListView(APIView):
    permission_classes = [IsAdminPermission]

    def get(self, request: Request):
        return Response("todo", status=status.HTTP_200_OK)


class UserRolesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request):
        roles = [{"id": value, "name": label} for value, label in User.ROLE_CHOICES]
        return Response(roles, status=status.HTTP_200_OK)
