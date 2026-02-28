from django.db import models
from django.contrib.auth.models import User


class Publication(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    role = models.CharField(max_length=255, blank=True)
    technologies = models.JSONField(default=list, blank=True)
    media_links = models.JSONField(default=list, blank=True)
    image = models.ImageField(upload_to='publications/', blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='publications')

    def __str__(self):
        return self.name


class PortfolioProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="portfolio_profile")
    full_name = models.CharField(max_length=255, blank=True)
    photo = models.ImageField(upload_to="profiles/", blank=True, null=True)
    cv = models.FileField(upload_to="cvs/", blank=True, null=True)
    contact_email = models.EmailField(blank=True)
    phone = models.CharField(max_length=64, blank=True)
    location = models.CharField(max_length=255, blank=True)
    social_links = models.JSONField(default=list, blank=True)

    summary = models.TextField(blank=True)

    work_experience = models.JSONField(default=list, blank=True)
    education = models.JSONField(default=list, blank=True)
    technical_skills = models.JSONField(default=list, blank=True)
    soft_skills = models.JSONField(default=list, blank=True)

    achievements = models.JSONField(default=list, blank=True)
    certifications = models.JSONField(default=list, blank=True)
    testimonials = models.JSONField(default=list, blank=True)

    professional_philosophy = models.TextField(blank=True)
    career_objectives = models.TextField(blank=True)
    hobbies = models.JSONField(default=list, blank=True)

    def __str__(self):
        return f"{self.user.username} profile"
