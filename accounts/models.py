from django.db import models
from django.contrib.auth.models import User


# Create your models here.
# https://docs.djangoproject.com/en/3.1/topics/auth/customizing/#extending-the-existing-user-model
class UserProfile(models.Model):
    user = models.OneToOneField(User, related_name='userProfile', on_delete=models.CASCADE)
    photo = models.ImageField(upload_to='photos/', blank=True, null=True)
