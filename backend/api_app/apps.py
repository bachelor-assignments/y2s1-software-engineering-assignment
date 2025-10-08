import os

from django.apps import AppConfig
from django.contrib.auth.hashers import make_password
from django.db.models.signals import post_migrate


def initialize_default_postgres_records(sender, **kwargs):
    from .models import User

    User.objects.get_or_create(
        username=os.environ["APP_DEFAULT_ADMIN_USERNAME"],
        defaults={
            "username": os.environ["APP_DEFAULT_ADMIN_USERNAME"],
            "password": make_password(os.environ["APP_DEFAULT_ADMIN_PASSWORD"]),
            "role": "admin",
        },
    )


class ApiAppConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "api_app"

    def ready(self):
        post_migrate.connect(initialize_default_postgres_records, sender=self)
