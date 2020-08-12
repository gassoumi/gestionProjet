from rest_framework import serializers

from .models import Project, UserProject, Sprint, Task, Document
from django.contrib.auth.models import User

"""
  name = models.CharField(max_length=500, unique=True)
    desired_at = models.DateTimeField()
    project = models.ForeignKey(Project, related_name="sprints", on_delete=models.CASCADE)
    state = models.CharField(choices=State.choices, max_length=50)
"""

"""
user = UserSerializer(many=False, read_only=True)
    user_id = serializers.IntegerField(write_only=True)
"""


# User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'is_staff')


# UserProject Serializer
class UserProjectSerializer(serializers.ModelSerializer):
    # user_id = serializers.IntegerField()
    # put it if it is required in json input for creating or updating the UserProjectModel
    # is_responsible = serializers.BooleanField()
    username = serializers.CharField(source='user.username')
    classification = serializers.ChoiceField(choices=UserProject.Classification)
    code_project = serializers.CharField(source='project.code_project', read_only=True)

    class Meta:
        fields = ('id', 'code_project', 'username', 'classification',)
        model = UserProject


# Project serializer
class ProjectSerializer(serializers.ModelSerializer):
    # if the name of the output is different
    # users = UserProjectSerializer(source='projectUsers', many=True)
    projectUsers = UserProjectSerializer(many=True, required=True, )

    class Meta:
        model = Project
        fields = ['code_project', 'designation', 'objective', 'created_at', 'projectUsers']
        # fields = "__all__"

    # check at least if user exist and have a scrum master classification in projectUsers field
    def validate(self, attrs):
        users = attrs.get('projectUsers')
        found_scrum_master = False
        for user in users:
            username = user.get('user').get('username')
            try:
                User.objects.get(username=username)
                classification = user.get('classification')
                if classification == UserProject.Classification.SCRUM_MASTER:
                    found_scrum_master = True
                    break
            except:
                pass
        if not found_scrum_master:
            raise serializers.ValidationError("Please choice at least a exiting user with Scrum master classification")
        return attrs

    def create(self, validated_data):
        authenticated_user = self.get_authenticated_user()
        project_users_data = validated_data.pop('projectUsers')
        project = Project.objects.create(**validated_data)
        # self.save_authenticed_user(authenticated_user, project)
        return self.get_saved_project(authenticated_user, project, project_users_data)

    def update(self, instance, validated_data):
        authenticated_user = self.get_authenticated_user()
        project_users_data = validated_data.pop('projectUsers')

        instance.designation = validated_data.get('designation', instance.designation)
        instance.objective = validated_data.get('objective', instance.objective)
        instance.save()

        user_projects = UserProject.objects.filter(project=instance)
        user_projects.delete()
        # self.save_authenticed_user(authenticated_user, instance)

        return self.get_saved_project(authenticated_user, instance, project_users_data)

    def get_saved_project(self, authenticated_user, project, project_users_data):
        for project_user_data in project_users_data:
            username = project_user_data.get('user').get('username')
            classification_input = project_user_data.get('classification')

            try:
                user = User.objects.get(username=username)
                if user and user.is_active and not user.is_superuser:
                    user_project = UserProject(user=user, project=project,
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


"""
user = UserSerializer(many=False, read_only=True)
    user_id = serializers.IntegerField(write_only=True)
"""


# Sprint serializer
class SprintSerializer(serializers.ModelSerializer):
    # project = ProjectSerializer(many=False, read_only=True)
    # code_project = serializers.CharField(write_only=True)

    class Meta:
        model = Sprint
        fields = "__all__"

    def validate(self, attrs):
        # raise Exception(attrs)
        project_to_found = attrs.get('project')
        authenticated_user = self.get_authenticated_user()
        try:
            # check if the authenticated user is participate to this project
            user_project = UserProject.objects.filter(user=authenticated_user, project=project_to_found).get()
        except:
            # the authenticated user can't add sprint to this project so return not found
            raise serializers.ValidationError("Project not found")
        return attrs

    def get_authenticated_user(self):
        authenticated_user = None
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            authenticated_user = User.objects.get(username=request.user)
        return authenticated_user

    """
     def save_authenticed_user(self, authenticated_user, project):
        if authenticated_user:
            user_project = UserProject(user=authenticated_user, project=project,
                                       classification=UserProject.Classification.PROJECT_OWNER)
            user_project.save()
    """


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = "__all__"

    def validate(self, data):
        """
        Check that start_at is before end_at.
        """
        if data['start_at'] > data['end_at']:
            raise serializers.ValidationError("La date de fin doit etre superieur au date de debut")
        if data['sprint'].state not in ['Planifiè', 'En Cours']:
            raise serializers.ValidationError("le statut du sprint doit etre Planifie ou En cours")
        return data


class DoumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = "__all__"
