from rest_framework import serializers
from .models import Project, UserProject
from django.contrib.auth.models import User


# User Serialize
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username',)


class ProjectSerializer(serializers.ModelSerializer):
    users = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = ['code_project', 'designation', 'objective', 'created_at', 'users']
        # fields = "__all__"
