from rest_framework import routers
from .api import ProjectViewSet, SprintViewSet, TaskViewSet, \
    ActiveSprintList, DocumentViewSet, CommentViewSet, DiscussionViewSet
from django.urls import path, include

# https://www.django-rest-framework.org/api-guide/routers/
router = routers.DefaultRouter()
router.register('projects', ProjectViewSet, 'projects')
router.register('sprints', SprintViewSet, 'sprints')
router.register('tasks', TaskViewSet, 'tasks')
router.register('documents', DocumentViewSet, 'documents')
router.register('discussions', DiscussionViewSet, 'discussions')
router.register('comments', CommentViewSet, 'comments')

urlpatterns = [
    path('activeSprints/', ActiveSprintList.as_view()),
]

urlpatterns += router.urls
