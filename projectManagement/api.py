from rest_framework import viewsets, permissions, status, generics
from rest_framework.response import Response
from .models import Project, UserProject, Sprint, Task, Document, Discussion, Comment, Note, Problem
from .serializers import ProjectSerializer, SprintSerializer, TaskSerializer, \
    DoumentSerializer, CommentSerializer, DiscussionSerializer, NoteSerializer, ProblemSerializer
from django.contrib.auth.models import User
from rest_framework import filters
from .customViewSet import CreateListRetrieveUpdateViewSet
from django.utils.timezone import now
from django.db.models import Count
from rest_framework.decorators import action


class IsResponsibleOrNot(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has an `owner` attribute.
    """

    def has_permission(self, request, view):
        # Read permissions are allowed to any request,
        # if permissions.IsAuthenticated().has_permission(
        #         request, view):
        #     return True
        #
        # return False
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        # so we'll always allow GET, HEAD or OPTIONS or POST requests.
        if request.method in permissions.SAFE_METHODS:
            return True
        # other method PUT ,DELETE or POST  , we check if the user is responsible of this project
        return request.user.is_staff


# Instance must have an attribute named `user`.
# only object owner or a a super user can update or delete this object
class UserIsOwnerOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        user = request.user
        # Instance must have an attribute named `user`.
        return bool(user and user.is_authenticated and
                    (user.is_superuser or obj.user == user))


# Sprint api for create , delete , update a sprint
class SprintViewSet(viewsets.ModelViewSet):
    serializer_class = SprintSerializer
    permission_classes = [IsResponsibleOrNot]
    filterset_fields = {
        'desired_at': ['gte', 'lte', 'exact', 'gt', 'lt'],
    }

    def get_queryset(self):
        user = self.request.user
        projects = Project.objects.filter(projectUsers__user=user)
        return Sprint.objects.filter(project__in=projects)

    def create(self, request, *args, **kwargs):
        # only the user who is staff can create a sprint
        # so check the permission first
        self.check_object_permissions(request, None)
        return super().create(request, args, kwargs)


# https://docs.djangoproject.com/en/3.1/topics/db/aggregation/
class TopDiscussionList(generics.ListAPIView):
    serializer_class = DiscussionSerializer
    permissions = {IsResponsibleOrNot}
    queryset = Discussion.objects.annotate(num_comments=Count('comment')).order_by('-num_comments')


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
        projects = Project.objects.filter(projectUsers__user=user)
        return Sprint.objects.filter(project__in=projects, status__in=['Planifiè', 'En Cours'])


# https://stackoverflow.com/questions/50524040/how-to-filter-the-data-use-equal-or-greater-than-condition-in-the-url
# https://stackoverflow.com/questions/58837940/django-rest-framework-filter-by-date-range
class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsResponsibleOrNot]
    filterset_fields = {
        'start_at': ['gte', 'lte', 'exact', 'gt', 'lt'],
        'end_at': ['gte', 'lte', 'exact', 'gt', 'lt'],
        'description': ['exact']}

    def get_queryset(self):
        user = self.request.user
        # get all projects of this user
        projects = Project.objects.filter(projectUsers__user=user)
        # get all sprints related to all of those projects
        sprints = Sprint.objects.filter(project__in=projects)
        # get all tasks related to all of those sprints
        tasks = Task.objects.filter(sprint__in=sprints)
        return tasks

    def create(self, request, *args, **kwargs):
        # only the user who is staff can create a task
        # so check the permission first
        self.check_object_permissions(request, None)
        return super().create(request, args, kwargs)


class DocumentViewSet(CreateListRetrieveUpdateViewSet):
    serializer_class = DoumentSerializer
    permission_classes = [permissions.IsAuthenticated]

    # https://www.django-rest-framework.org/api-guide/filtering/
    def get_queryset(self):
        queryset = Document.objects.all()
        status_document = self.request.query_params.get('status', None)
        if status_document is not None:
            queryset = queryset.filter(status=status_document)
        return queryset


class NoteViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = NoteSerializer

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(user=user)


class DiscussionViewSet(viewsets.ModelViewSet):
    queryset = Discussion.objects.all()
    serializer_class = DiscussionSerializer
    permission_classes = [UserIsOwnerOrAdmin]


class ProblemViewSet(viewsets.ModelViewSet):
    queryset = Problem.objects.all()
    serializer_class = ProblemSerializer
    permission_classes = [UserIsOwnerOrAdmin]


# https://www.django-rest-framework.org/api-guide/filtering/
class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [UserIsOwnerOrAdmin]
    # If all you need is simple equality-based filtering,
    # you can set a filterset_fields attribute on the view, or viewset,
    # listing the set of fields you wish to filter again
    filterset_fields = ['discussion', 'user', 'description']

    def perform_update(self, serializer):
        serializer.save(modified_at=now())


# see also https://www.django-rest-framework.org/tutorial/3-class-based-views/


# Project api
class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [IsResponsibleOrNot]
    filter_backends = (filters.SearchFilter, filters.OrderingFilter)
    search_fields = ['designation', 'code']
    ordering_fields = ['created_at']
    http_method_names = ['get', 'post', 'head', 'put', 'delete', 'options']

    def get_queryset(self):
        # show only projects of specific authenticated user
        # or return a list of all the project for the currently authenticated user.
        return self.request.user.project_set.all()

    @action(detail=True, methods=['get'])
    def tasks(self, request, pk=None):
        project = self.get_object()
        sprints = project.sprints.all()
        tasks = Task.objects.filter(sprint__in=sprints).order_by('-end_at')
        page = self.paginate_queryset(tasks)
        if page is not None:
            serializer = TaskSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def stat(self, request, pk=None):
        project = self.get_object()
        sprints = project.sprints.all()
        tasks = Task.objects.filter(sprint__in=sprints)
        count_tasks = tasks.count()
        # annotate = group by
        # https://stackoverflow.com/questions/629551/how-to-query-as-group-by-in-django
        # https://simpleisbetterthancomplex.com/tutorial/2016/12/06/how-to-create-group-by-queries.html
        all_status = tasks.values('status').annotate(count=Count('status'))
        # return Response({
        #     # 'count': count_tasks,
        #     'status': all_status
        # })
        return Response(all_status)

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
