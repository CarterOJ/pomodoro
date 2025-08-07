from django.db import models
from django.conf import settings

# Create your models here.
class Task(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    work_cycles = models.PositiveSmallIntegerField()
    notes = models.TextField(blank=True)