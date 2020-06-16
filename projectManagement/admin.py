from django.contrib import admin
from .models import Project, Task, Sprint, Discussion, Classification, Comment, Document, Video
# Register your models here.

admin.site.register(Project)
admin.site.register(Task)
admin.site.register(Sprint)
admin.site.register(Discussion)
admin.site.register(Classification)
admin.site.register(Comment)
admin.site.register(Document)
admin.site.register(Video)
