from django.urls import path
from .views import (
    CurrentUserPortfolioProfileAPI,
    CurrentUserPublicationsAPI,
    CreatePublicationAPI,
    DeletePublicationAPI,
    PublicPortfolioProfileAPI,
    PublicationDetailAPI,
    UpdatePublicationAPI,
    UserPublicationsByIdAPI,
)

urlpatterns = [
    path('profile/mine/', CurrentUserPortfolioProfileAPI.as_view(), name='my-profile'),
    path('profile/user/<int:user_id>/', PublicPortfolioProfileAPI.as_view(), name='public-profile'),
    path('create/', CreatePublicationAPI.as_view()),
    path('mine/', CurrentUserPublicationsAPI.as_view(), name='my-publications'),
    path('<int:pk>/', PublicationDetailAPI.as_view(), name='publication-detail'),
    path('user/<int:user_id>/', UserPublicationsByIdAPI.as_view(), name='user-publications-by-id'),
    path('update/<int:pk>/', UpdatePublicationAPI.as_view()),
    path('delete/<int:pk>/', DeletePublicationAPI.as_view()),
]
