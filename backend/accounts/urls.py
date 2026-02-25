from django.urls import path
from .views import CurrentUserAPI, LoginAPI, PublicUserAPI, RegisterAPI

urlpatterns = [
    path('register/', RegisterAPI.as_view(), name='register'),
    path('login/', LoginAPI.as_view(), name='login'),
    path('user/', CurrentUserAPI.as_view(), name='current-user'),
    path('public/<int:user_id>/', PublicUserAPI.as_view(), name='public-user'),
]
