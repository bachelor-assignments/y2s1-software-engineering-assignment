from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from api_app.models import User
from api_app.permissions import IsAdminPermission
from api_app.serializers import UserSerializer, PaginationSerializer


class UserView(APIView):
    permission_classes = [IsAdminPermission]

    def post(self, request: Request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def put(self, request: Request, user_id=None):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response("User does not exist.", status=status.HTTP_404_NOT_FOUND)

        user_serializer = UserSerializer(instance=user, data=request.data, action="put")
        user_serializer.is_valid(raise_exception=True)

        user_serializer.save()
        return Response(user_serializer.data, status=status.HTTP_200_OK)

    def delete(self, request: Request, user_id=None):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response("User does not exist.", status=status.HTTP_404_NOT_FOUND)

        user.delete()
        return Response(status=status.HTTP_200_OK)


class UserListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request):
        pagination_serializer = PaginationSerializer(data=request.query_params)
        pagination_serializer.is_valid(raise_exception=True)

        page_index = pagination_serializer.validated_data["page_index"]
        page_size = pagination_serializer.validated_data["page_size"]
        offset = page_index * page_size
        limit = page_size

        users = User.objects.all()
        user_count = users.count()
        serializer: list[User] = UserSerializer(
            users[offset : offset + limit], many=True
        )

        return Response(
            {
                "users": serializer.data,
                "count": user_count,
                "page_index": page_index,
                "page_size": page_size,
                "total_pages": (user_count + page_size - 1) // page_size,
            },
            status=status.HTTP_200_OK,
        )


class UserRolesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request):
        roles = [{"id": value, "name": label} for value, label in User.ROLE_CHOICES]
        return Response(roles, status=status.HTTP_200_OK)
