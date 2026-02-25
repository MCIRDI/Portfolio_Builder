import json

from rest_framework import serializers
from .models import PortfolioProfile, Publication


class JSONListParsingMixin:
    list_json_fields = ()

    def validate(self, attrs):
        attrs = super().validate(attrs)

        for field_name in self.list_json_fields:
            raw_value = self.initial_data.get(field_name)
            if raw_value is None:
                continue

            if isinstance(raw_value, str):
                try:
                    parsed = json.loads(raw_value)
                except json.JSONDecodeError as exc:
                    raise serializers.ValidationError(
                        {field_name: "Must be valid JSON."}
                    ) from exc
            else:
                parsed = raw_value

            if not isinstance(parsed, list):
                raise serializers.ValidationError(
                    {field_name: "Must be a JSON array."}
                )
            attrs[field_name] = parsed

        return attrs


class PublicationSerializer(JSONListParsingMixin, serializers.ModelSerializer):
    image = serializers.ImageField(
        use_url=True,
        required=False,
        allow_null=True,
    )
    technologies = serializers.JSONField(required=False)
    media_links = serializers.JSONField(required=False)
    list_json_fields = ("technologies", "media_links")

    class Meta:
        model = Publication
        fields = [
            'id',
            'name',
            'description',
            'role',
            'technologies',
            'media_links',
            'image',
        ]


class PortfolioProfileSerializer(JSONListParsingMixin, serializers.ModelSerializer):
    photo = serializers.ImageField(
        use_url=True,
        required=False,
        allow_null=True,
    )
    user_id = serializers.IntegerField(source="user.id", read_only=True)
    username = serializers.CharField(source="user.username", read_only=True)

    social_links = serializers.JSONField(required=False)
    work_experience = serializers.JSONField(required=False)
    education = serializers.JSONField(required=False)
    technical_skills = serializers.JSONField(required=False)
    soft_skills = serializers.JSONField(required=False)
    achievements = serializers.JSONField(required=False)
    certifications = serializers.JSONField(required=False)
    testimonials = serializers.JSONField(required=False)
    hobbies = serializers.JSONField(required=False)

    list_json_fields = (
        "social_links",
        "work_experience",
        "education",
        "technical_skills",
        "soft_skills",
        "achievements",
        "certifications",
        "testimonials",
        "hobbies",
    )

    class Meta:
        model = PortfolioProfile
        fields = [
            "user_id",
            "username",
            "full_name",
            "photo",
            "contact_email",
            "phone",
            "location",
            "social_links",
            "summary",
            "work_experience",
            "education",
            "technical_skills",
            "soft_skills",
            "achievements",
            "certifications",
            "testimonials",
            "professional_philosophy",
            "career_objectives",
            "hobbies",
        ]
