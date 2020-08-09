from django.contrib import admin
from .models import Project, Task, Sprint, Discussion, \
    Comment, Document, Video, UserProject


# Register your models here.

class ProjectAdmin(admin.ModelAdmin):
    # fields = ['objective', 'designation', 'created_at']
    list_display = ['code_project', 'designation', 'objective', 'created_at']


class ProjectUsersAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'project', 'classification', 'is_scrum_master']


class SprintAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'project', 'desired_at', 'state']


class TaskAdmin(admin.ModelAdmin):
    list_display = ['id', 'description', 'start_at', 'end_at', 'sprint', 'user', 'state']


class DocumentAdmin(admin.ModelAdmin):
    list_display = ['id', 'description', 'version', 'task', 'created_at',
                    'get_doc_file_name', 'get_doc_file_path']


admin.site.register(Project, ProjectAdmin)
admin.site.register(Task, TaskAdmin)
admin.site.register(Sprint, SprintAdmin)
admin.site.register(Discussion)
admin.site.register(Comment)
admin.site.register(Document, DocumentAdmin)
admin.site.register(Video)
admin.site.register(UserProject, ProjectUsersAdmin)
