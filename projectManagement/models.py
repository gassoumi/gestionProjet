from django.db import models
from django.contrib.auth.models import User
import ntpath
import os


def get_file_name2(path):
    head, tail = ntpath.split(path)
    return tail or ntpath.basename(head)


def get_file_name(path):
    return os.path.basename(path)


class Classification(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    classification = models.CharField(max_length=200)

    def __str__(self):
        return self.classification


class Discussion(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    object = models.CharField(max_length=200)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return self.object


class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    discussion = models.ForeignKey(Discussion, on_delete=models.CASCADE)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return self.description


class Project(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    designation = models.CharField(max_length=200)
    objective = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['designation']

    def __str__(self):
        return self.designation


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
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return get_file_name(self.path)


class Sprint(models.Model):
    name = models.CharField(max_length=500)
    desired_at = models.DateTimeField()
    project = models.ForeignKey(Project, on_delete=models.CASCADE)

    class Meta:
        ordering = ['desired_at']

    def __str__(self):
        return self.name
