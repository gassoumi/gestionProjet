from rest_framework import routers
from .api import ProjectViewSet, SprintViewSet, TaskViewSet, ActiveSprintList
from django.urls import path, include

# https://www.django-rest-framework.org/api-guide/routers/
router = routers.DefaultRouter()
router.register('projects', ProjectViewSet, 'projects')
router.register('sprints', SprintViewSet, 'sprints')
router.register('tasks', TaskViewSet, 'tasks')

urlpatterns = [
    path('activeSprints/', ActiveSprintList.as_view()),
]

urlpatterns += router.urls
