from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Project, UserProject
from .serializers import ProjectSerializer
from django.contrib.auth.models import User


class IsResponsibleOrNot(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has an `owner` attribute.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if not permissions.IsAuthenticated().has_permission(request, view):
            return False

        if permissions.IsAdminUser().has_permission(request, view):
            return True

        if request.method in permissions.SAFE_METHODS or request.method == 'POST':
            return True
        # other method PUT or DELETE , we check if the user is responsible of this project
        else:
            try:
                user_project = UserProject.objects.get(user=request.user, project=obj)
                if user_project and user_project.is_responsible:
                    return True
            except:
                pass
        return False


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [IsResponsibleOrNot]

    def get_queryset(self):
        # show all projects
        return Project.objects.all()
        # show only projects of specific user
        # or return a list of all the project for the currently authenticated user.
        # return self.request.user.project_set.all()

    def create(self, request, *args, **kwargs):
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
