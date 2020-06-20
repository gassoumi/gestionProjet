from django.contrib import admin
from .models import Project, Task, Sprint, Discussion, Classification, Comment, Document, Video, UserProject


# Register your models here.

class ProjectAdmin(admin.ModelAdmin):
    # fields = ['objective', 'designation', 'created_at']
    list_display = ['objective', 'designation', 'created_at']


admin.site.register(Project, ProjectAdmin)
admin.site.register(Task)
admin.site.register(Sprint)
admin.site.register(Discussion)
admin.site.register(Classification)
admin.site.register(Comment)
admin.site.register(Document)
admin.site.register(Video)
admin.site.register(UserProject)
