import os
import uuid
from django.core.files.storage import FileSystemStorage
from storages.backends.s3boto3 import S3Boto3Storage
from django.conf import settings


class CustomMediaStorage(FileSystemStorage):
    """
    Custom storage backend that handles both local and S3 storage
    with proper fallback and error handling for Render's ephemeral storage
    """
    
    def __init__(self, **kwargs):
        self.use_s3 = not settings.DEBUG and hasattr(settings, 'AWS_ACCESS_KEY_ID') and settings.AWS_ACCESS_KEY_ID
        if self.use_s3:
            self.s3_storage = S3Boto3Storage()
            # Use /tmp for local fallback
            location = kwargs.get('location', '/tmp/media')
        else:
            self.s3_storage = None
            # Use persistent directory for local storage
            location = kwargs.get('location', getattr(settings, 'MEDIA_ROOT', '/tmp/media'))
        
        os.makedirs(location, exist_ok=True)
        super().__init__(location=location, **kwargs)
    
    def save(self, name, content, max_length=None):
        # Generate unique filename to prevent conflicts
        ext = name.split('.')[-1] if '.' in name else ''
        unique_name = f"{uuid.uuid4()}.{ext}" if ext else str(uuid.uuid4())
        
        if self.use_s3:
            try:
                return self.s3_storage.save(unique_name, content, max_length)
            except Exception as e:
                print(f"S3 storage failed: {e}, falling back to local storage")
                # Fallback to local storage
                return super().save(unique_name, content, max_length)
        else:
            return super().save(unique_name, content, max_length)
    
    def url(self, name):
        if self.use_s3 and self.s3_storage:
            try:
                return self.s3_storage.url(name)
            except Exception as e:
                print(f"S3 URL generation failed: {e}, falling back to local URL")
                # Fallback to local URL
                return super().url(name)
        else:
            return super().url(name)
    
    def exists(self, name):
        if self.use_s3 and self.s3_storage:
            try:
                return self.s3_storage.exists(name)
            except Exception:
                # Check local storage as fallback
                return super().exists(name)
        else:
            return super().exists(name)
    
    def delete(self, name):
        if self.use_s3 and self.s3_storage:
            try:
                return self.s3_storage.delete(name)
            except Exception as e:
                print(f"S3 delete failed: {e}")
                return False
        else:
            return super().delete(name)
