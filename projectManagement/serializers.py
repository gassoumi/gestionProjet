from rest_framework import serializers
from .models import Project, UserProject
from django.contrib.auth.models import User


# User Serialize
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username',)


# UserProject Serializer
class UserProjectSerializer(serializers.ModelSerializer):
    user_id = serializers.Field()
    is_responsible = serializers.BooleanField()
    username = serializers.ReadOnlyField(source='user.username')
    classification = serializers.CharField()

    def to_internal_value(self, data):
        user_id = data.get('user_id')
        is_responsible = data.get('is_responsible')
        classification = data.get('classification')
        # Perform the data validation.
        if not user_id:
            raise serializers.ValidationError({
                'user_id': 'This field is required.'
            })
        return {
            'user_id': int(user_id),
            'is_responsible': bool(is_responsible),
            'classification': classification
        }

    def to_representation(self, instance):
        return {
            'user_id': instance.user_id,
            'username': instance.user.username,
            'is_responsible': instance.is_responsible,
            'classification': instance.classification
        }

    class Meta:
        fields = ('user_id', 'is_responsible', 'username', 'classification')
        model = UserProject


# Project serializer
class ProjectSerializer(serializers.ModelSerializer):
    # if the name of the output is different
    # users = UserProjectSerializer(source='projectUsers', many=True)
    projectUsers = UserProjectSerializer(many=True, required=True)

    class Meta:
        model = Project
        fields = ['code_project', 'designation', 'objective', 'created_at', 'projectUsers']
        # fields = "__all__"

    def create(self, validated_data):
        authenticated_user = self.get_authenticated_user()

        project_users_data = validated_data.pop('projectUsers')
        project = Project.objects.create(**validated_data)

        if authenticated_user:
            user_project = UserProject(user=authenticated_user, project=project, is_responsible=True)
            user_project.save()

        return self.get_saved_project(authenticated_user, project, project_users_data)

    def update(self, instance, validated_data):
        authenticated_user = self.get_authenticated_user()
        project_users_data = validated_data.pop('projectUsers')

        instance.designation = validated_data.get('designation', instance.designation)
        instance.objective = validated_data.get('objective', instance.objective)
        instance.save()

        user_projects = UserProject.objects.filter(project=instance)
        user_projects.delete()
        if authenticated_user:
            user_project = UserProject(user=authenticated_user, project=instance, is_responsible=True)
            user_project.save()

        return self.get_saved_project(authenticated_user, instance, project_users_data)

    def get_saved_project(self, authenticated_user, project, project_users_data):
        for project_user_data in project_users_data:
            user_id = project_user_data.get('user_id')

            try:
                user = User.objects.get(pk=user_id)
                if user and user.is_active and not user.is_superuser and user.username != authenticated_user.username:
                    user_project = UserProject(user=user, project=project, is_responsible=False)
                    user_project.save()
            except Exception as e:
                pass
        return project

    def get_authenticated_user(self):
        authenticated_user = None
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            authenticated_user = User.objects.get(username=request.user)
        return authenticated_user
