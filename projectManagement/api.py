from rest_framework import viewsets, permissions
from .serializers import ProjectSerializer, UserProject
from .models import Project


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # show all projects
        # return Project.objects.all()
        # show only projects of specific user
        """
            This view should return a list of all the purchases
            for the currently authenticated user.
         """
        return self.request.user.project_set.all()
