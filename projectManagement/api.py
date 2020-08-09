from rest_framework import viewsets, permissions, status, generics
from rest_framework.response import Response
from .models import Project, UserProject, Sprint, Task
from .serializers import ProjectSerializer, SprintSerializer, TaskSerializer
from django.contrib.auth.models import User
from rest_framework import filters


class IsResponsibleOrNot(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has an `owner` attribute.
    """

    def has_permission(self, request, view):
        # Read permissions are allowed to any request,
        if permissions.IsAuthenticated().has_permission(
                request, view):
            return True

        return False

    def has_object_permission(self, request, view, obj):
        # so we'll always allow GET, HEAD or OPTIONS or POST requests.
        if request.method in permissions.SAFE_METHODS:
            return True
        # other method PUT ,DELETE or POST  , we check if the user is responsible of this project
        return request.user.is_staff


# Sprint api for create , delete , update a sprint
class SprintViewSet(viewsets.ModelViewSet):
    serializer_class = SprintSerializer
    permission_classes = [IsResponsibleOrNot]

    def get_queryset(self):
        user = self.request.user
        projects = Project.objects.filter(projectUsers__user=user).values('code_project')
        return Sprint.objects.filter(project__code_project__in=projects)

    def create(self, request, *args, **kwargs):
        # only the user who is staff can create a sprint
        # so check the permission first
        self.check_object_permissions(request, None)
        return super().create(request, args, kwargs)


class ActiveSprintList(generics.ListAPIView):
    serializer_class = SprintSerializer
    permission_classes = [IsResponsibleOrNot]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', ]
    ordering = ['name']

    def get_queryset(self):
        """
        This view should return a list of all the sprint that planned (planifié)
        or In progress (En Cours)
        for the currently authenticated user.
        """
        user = self.request.user
        projects = Project.objects.filter(projectUsers__user=user).values('code_project')
        return Sprint.objects.filter(project__code_project__in=projects, state__in=['Planifiè', 'En Cours'])


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsResponsibleOrNot]

    def get_queryset(self):
        user = self.request.user
        # get all projects of this user
        projects = Project.objects.filter(projectUsers__user=user).values('code_project')
        # get all sprints related to all of those projects
        sprints = Sprint.objects.filter(project__code_project__in=projects).values('id')
        # get all tasks related to all of those sprints
        tasks = Task.objects.filter(sprint_id__in=sprints)
        return tasks

    def create(self, request, *args, **kwargs):
        # only the user who is staff can create a task
        # so check the permission first
        self.check_object_permissions(request, None)
        return super().create(request, args, kwargs)


# see also https://www.django-rest-framework.org/tutorial/3-class-based-views/
# Project api
class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [IsResponsibleOrNot]
    filter_backends = [filters.SearchFilter]
    search_fields = ['designation', 'code_project']
    ordering = ['designation']
    http_method_names = ['get', 'post', 'head', 'put', 'delete', 'options']

    def get_queryset(self):
        # show only projects of specific authenticated user
        # or return a list of all the project for the currently authenticated user.
        return self.request.user.project_set.all()

    def create(self, request, *args, **kwargs):
        self.check_object_permissions(request, None)
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        self.check_object_permissions(request, instance)
        serializer = self.get_serializer(instance, data=request.data, partial=partial, context={'request': request})
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()

        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)
