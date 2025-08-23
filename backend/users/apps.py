from django.apps import AppConfig
from django.contrib.auth import get_user_model
import os

class UsersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'users'

    def ready(self):
        User = get_user_model()
        if not User.objects.filter(username="admin").exists():
            User.objects.create_superuser(
                username=os.getenv("ADMIN_USERNAME"),
                email=os.getenv("ADMIN_EMAIL"),
                password=os.getenv("ADMIN_PASSWORD")
            )