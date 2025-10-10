from rest_framework.permissions import BasePermission, SAFE_METHODS
from api_app.models import User


class RoleCrudPermission(BasePermission):
    def has_permission(self, request, view):
        user: User = request.user

        if not user.is_authenticated:
            return False

        if user.role == "admin":
            return True
        elif user.role == "editor":
            return request.method in ("GET", "POST", "PUT")
        elif user.role == "viewer":
            return request.method == "GET"
        else:
            return False


class IsAdminPermission(BasePermission):
    def has_permission(self, request, view):
        user: User = request.user

        if not user.is_authenticated:
            return False

        return user.role == "admin"
