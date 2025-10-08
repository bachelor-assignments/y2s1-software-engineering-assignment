import os

from django.apps import AppConfig
from django.db.models.signals import post_migrate


def initialize_default_postgres_records(sender, **kwargs):
    from .models import Role, User

    role_defaults = [
        {
            "name": "admin",
            "description": "privileged user that manage sensitive system configs",
        },
        {
            "name": "editor",
            "description": "internal staff, manage assets that they own, view any assets",
        },
        {
            "name": "viewer",
            "description": "unprivileged user, able to view assets only",
        },
    ]
    for data in role_defaults:
        Role.objects.get_or_create(name=data["name"], defaults=data)

    User.objects.get_or_create(
        username=os.environ["APP_DEFAULT_ADMIN_USERNAME"],
        defaults={
            "username": os.environ["APP_DEFAULT_ADMIN_USERNAME"],
            "password": os.environ["APP_DEFAULT_ADMIN_PASSWORD"],
            "role": Role.objects.get(name="admin"),
        },
    )


class ApiAppConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "api_app"

    def ready(self):
        post_migrate.connect(initialize_default_postgres_records, sender=self)
