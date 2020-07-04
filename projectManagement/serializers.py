from rest_framework import serializers
from .models import Project, UserProject
from django.contrib.auth.models import User


# User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username',)


# UserProject Serializer
class UserProjectSerializer(serializers.ModelSerializer):
    # user_id = serializers.IntegerField()
    # put it if it is required in json input for creating or updating the UserProjectModel
    # is_responsible = serializers.BooleanField()
    username = serializers.CharField(source='user.username')
    classification = serializers.ChoiceField(choices=UserProject.Classification)

    class Meta:
        fields = ('username', 'is_responsible', 'classification',)
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
        self.save_authenticed_user(authenticated_user, project)
        return self.get_saved_project(authenticated_user, project, project_users_data)

    def update(self, instance, validated_data):
        authenticated_user = self.get_authenticated_user()
        project_users_data = validated_data.pop('projectUsers')

        instance.designation = validated_data.get('designation', instance.designation)
        instance.objective = validated_data.get('objective', instance.objective)
        instance.save()

        user_projects = UserProject.objects.filter(project=instance)
        user_projects.delete()
        self.save_authenticed_user(authenticated_user, instance)

        return self.get_saved_project(authenticated_user, instance, project_users_data)

    def save_authenticed_user(self, authenticated_user, project):
        if authenticated_user:
            user_project = UserProject(user=authenticated_user, project=project, is_responsible=True,
                                       classification=UserProject.Classification.PROJECT_OWNER)
            user_project.save()

    def get_saved_project(self, authenticated_user, project, project_users_data):
        for project_user_data in project_users_data:
            username = project_user_data.get('user').get('username')
            classification_input = project_user_data.get('classification')

            try:
                user = User.objects.get(username=username)
                if user and user.is_active and not user.is_superuser and user.username != authenticated_user.username:
                    user_project = UserProject(user=user, project=project, is_responsible=False,
                                               classification=classification_input)
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
