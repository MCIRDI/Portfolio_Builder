from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import PortfolioProfile, Publication
from .serializers import PortfolioProfileSerializer, PublicationSerializer
from django.contrib.auth.models import User
from rest_framework.exceptions import NotFound


def get_or_create_profile(user):
    defaults = {
        "full_name": user.get_full_name() or user.username,
        "contact_email": user.email,
    }
    profile, _ = PortfolioProfile.objects.get_or_create(user=user, defaults=defaults)
    return profile


# Create publication
class CreatePublicationAPI(generics.CreateAPIView):
    serializer_class = PublicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# Get all publications of logged-in user
class CurrentUserPublicationsAPI(generics.ListAPIView):
    serializer_class = PublicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Publication.objects.filter(user=self.request.user).order_by("-id")


class UserPublicationsByIdAPI(generics.ListAPIView):
    serializer_class = PublicationSerializer
    permission_classes = [permissions.AllowAny]  # anyone can view

    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            raise NotFound("User not found")
        return Publication.objects.filter(user=user).order_by("-id")


class PublicationDetailAPI(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PublicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Publication.objects.filter(user=self.request.user)


class CurrentUserPortfolioProfileAPI(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile = get_or_create_profile(request.user)
        serializer = PortfolioProfileSerializer(profile)
        return Response(serializer.data)

    def patch(self, request):
        profile = get_or_create_profile(request.user)
        serializer = PortfolioProfileSerializer(
            profile,
            data=request.data,
            partial=True,
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def put(self, request):
        profile = get_or_create_profile(request.user)
        serializer = PortfolioProfileSerializer(
            profile,
            data=request.data,
            partial=False,
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class PublicPortfolioProfileAPI(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            raise NotFound("User not found")

        profile = get_or_create_profile(user)
        serializer = PortfolioProfileSerializer(profile)
        return Response(serializer.data)


# Update publication
class UpdatePublicationAPI(generics.UpdateAPIView):
    serializer_class = PublicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Publication.objects.filter(user=self.request.user)

# Delete publication
class DeletePublicationAPI(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Publication.objects.filter(user=self.request.user)

