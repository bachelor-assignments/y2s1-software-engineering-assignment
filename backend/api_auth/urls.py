from django.urls import path
from .views import MyTokenObtainPairView, MyTokenRefreshView, LogoutView

urlpatterns = [
    path("logout", LogoutView.as_view()),
    path("token/", MyTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", MyTokenRefreshView.as_view(), name="token_refresh"),
]
