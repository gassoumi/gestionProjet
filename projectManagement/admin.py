from django.contrib import admin
from .models import Project, Task, Sprint, Discussion, Comment, Document, Video, UserProject


# Register your models here.

class ProjectAdmin(admin.ModelAdmin):
    # fields = ['objective', 'designation', 'created_at']
    list_display = ['code_project', 'designation', 'objective', 'created_at']


class ProjectUsers(admin.ModelAdmin):
    list_display = ['user', 'project', 'classification', 'is_responsible', 'is_project_owner']


admin.site.register(Project, ProjectAdmin)
admin.site.register(Task)
admin.site.register(Sprint)
admin.site.register(Discussion)
admin.site.register(Comment)
admin.site.register(Document)
admin.site.register(Video)
admin.site.register(UserProject, ProjectUsers)
