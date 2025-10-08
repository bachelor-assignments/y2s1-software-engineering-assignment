from django.urls import path
from .module_views import asset_view, user_view
from . import views

urlpatterns = [
    path("ping/", views.PingView.as_view()),
    ### User
    path("user/", user_view.UserView.as_view()),
    path("user/<int:user_id>/", user_view.UserView.as_view()),
    path("user/list/", user_view.UserListView.as_view()),
    path("user/roles/", user_view.UserRolesView.as_view()),
    ### Asset
    path("asset/", asset_view.AssetView.as_view()),
    path("asset/<int:asset_id>/", asset_view.AssetView.as_view()),
    path("asset/list/", asset_view.AssetListView.as_view()),
    path("asset/<int:asset_id>/versions", asset_view.AssetVersionView.as_view()),
]
