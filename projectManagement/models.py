from django.db import models
from .apps import ProjectmanagementConfig
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _

from django.utils.timezone import now
import ntpath
import os


# models representing database of the current app

def get_file_name2(path):
    head, tail = ntpath.split(path)
    return tail or ntpath.basename(head)


def get_file_name(path):
    return os.path.basename(path)


class Discussion(models.Model):
    user = models.ForeignKey(User, related_name="discussions", on_delete=models.CASCADE)
    object = models.CharField(max_length=200)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return self.object


class Comment(models.Model):
    user = models.ForeignKey(User, related_name="comments", on_delete=models.CASCADE)
    discussion = models.ForeignKey(Discussion, on_delete=models.CASCADE)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return self.description


class Project(models.Model):
    code_project = models.CharField(max_length=200, primary_key=True)
    designation = models.CharField(max_length=200)
    objective = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    users = models.ManyToManyField(User, through='UserProject')

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return self.designation


class UserProject(models.Model):
    class Classification(models.TextChoices):
        SCRUM_MASTER = 'Scrum Master', _('Scrum Master')
        PROJECT_OWNER = 'Project Owner', _('Project Owner')
        TEAM_OWNER = 'Team Leader', _('Team Leader')
        RESPONSIBLE_DEVELOPMENT = 'Responsible Development', _('Responsible Development')
        RESPONSIBLE = 'Responsible', _('Responsible')
        CONCEPTION = 'Conception', _('Conception')
        EXECUTIVE_ASSISTANT = 'Executive Assistant', _('Executive Assistant')

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, related_name="projectUsers", on_delete=models.CASCADE)
    is_responsible = models.BooleanField(default=False)
    classification = models.CharField(choices=Classification.choices, max_length=50)

    def is_project_owner(self):
        return self.classification == self.Classification.PROJECT_OWNER

    is_project_owner.boolean = True
    is_project_owner.short_description = 'Is Project Owner?'
    is_project_owner.admin_order_field = 'classification'

    def __str__(self):
        return '%s- %s' % (self.project.designation, self.user.username)

    class Meta:
        db_table = ProjectmanagementConfig.name + "_user_project"
        unique_together = (("user", "project"),)


class Video(models.Model):
    path = models.CharField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return get_file_name(self.path)


class Task(models.Model):
    description = models.CharField(max_length=200)
    start_at = models.DateTimeField()
    end_at = models.DateTimeField()
    state = models.CharField(max_length=20)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    videos = models.ManyToManyField(Video)


class Document(models.Model):
    path = models.CharField(max_length=500)
    version = models.CharField(max_length=20)
    description = models.CharField(max_length=200)
    task = models.ForeignKey(Task, related_name="documents", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return get_file_name(self.path)


class Sprint(models.Model):
    name = models.CharField(max_length=500)
    desired_at = models.DateTimeField()
    project = models.ForeignKey(Project, related_name="sprints", on_delete=models.CASCADE)

    class Meta:
        ordering = ['desired_at']

    def __str__(self):
        return self.name
