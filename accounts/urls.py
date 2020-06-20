from django.urls import path, include

from knox.views import LogoutView

from .api import RegisterApi, LoginApi, UserApi

urlpatterns = [
    path('', include('knox.urls')),
    path('register', RegisterApi.as_view()),
    path('login', LoginApi.as_view()),
    path('user', UserApi.as_view()),
    path('logout', LogoutView.as_view(), name='knox_logout')
]
