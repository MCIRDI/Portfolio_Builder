from rest_framework import serializers
from .models import Publication

class PublicationSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True)
    class Meta:
        model = Publication
        fields = ['id', 'name', 'description', 'image']
