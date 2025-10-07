from django.urls import path
from .module_views import auth, asset, user
from . import views

urlpatterns = [
    path("ping/", views.Ping.as_view()),
    ### Auth
    path("auth/login/", auth.Login.as_view()),
    ### User
    path("user/", user.User.as_view()),
    path("user/<int:user_id>/", user.User.as_view()),
    path("user/list/", user.UserList.as_view()),
    path("user/roles/", user.UserRoles.as_view()),
    # ### Asset
    path("asset/", asset.Asset.as_view()),
    path("asset/<int:asset_id>/", asset.Asset.as_view()),
    path("asset/list/", asset.AssetList.as_view()),
    path("asset/<int:asset_id>/versions", asset.AssetVersion.as_view()),
]
