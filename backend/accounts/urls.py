from django.urls import path
from .views import RegisterAPI, LoginAPI,CurrentUserAPI
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path('register/', RegisterAPI.as_view(), name='register'),
 path('login/', LoginAPI.as_view(), name='login'),
  path('user/', CurrentUserAPI.as_view(), name='current-user'),
]
