from django.conf import settings
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.response import Response
from rest_framework import status


from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response


class MyTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)  # validates credentials
        data = serializer.validated_data

        user = serializer.user

        response = Response({"message": "Login successful"})

        response.set_cookie(
            "access_token",
            data["access"],
            httponly=True,
            secure=getattr(settings, "SECURE_COOKIE", False),
            samesite="Lax",
            expires=300,  # 5 mins
        )
        response.set_cookie(
            "refresh_token",
            data["refresh"],
            httponly=True,
            secure=getattr(settings, "SECURE_COOKIE", False),
            samesite="Lax",
            expires=86400,  # 1 day
        )

        # set extra cookies
        response.set_cookie(
            "username",
            user.username,
            samesite="Lax",
            secure=getattr(settings, "SECURE_COOKIE", False),
        )
        response.set_cookie(
            "role",
            getattr(user, "role", ""),
            samesite="Lax",
            secure=getattr(settings, "SECURE_COOKIE", False),
        )

        return response


class MyTokenRefreshView(TokenRefreshView):
    def post(self, request):
        refresh_token = request.COOKIES.get("refresh_token")
        if not refresh_token:
            return Response(
                {"detail": "No refresh token"}, status=status.HTTP_401_UNAUTHORIZED
            )

        serializer = self.get_serializer(data={"refresh": refresh_token})
        try:
            serializer.is_valid(raise_exception=True)
        except Exception:
            return Response(
                {"detail": "Invalid refresh token"}, status=status.HTTP_401_UNAUTHORIZED
            )

        data = serializer.validated_data
        access_token = data.get("access")

        response = Response({"detail": "Token refreshed"})
        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=getattr(settings, "SECURE_COOKIE", False),
            samesite="Lax",
            max_age=60 * 5,
        )

        return response
