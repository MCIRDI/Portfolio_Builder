# AWS S3 Storage Setup for Portfolio Builder

This document explains how to set up AWS S3 storage to fix the issue where uploaded images disappear after some time due to Render's ephemeral storage.

## Problem
Render's free tier uses ephemeral storage, which means:
- Uploaded files are stored in the container's filesystem
- When Render restarts the service (periodically), all files are lost
- Images work initially but disappear after service restarts

## Solution: AWS S3 Storage
Set up AWS S3 to store media files persistently.

### Step 1: Create AWS S3 Bucket
1. Go to AWS Console → S3
2. Click "Create bucket"
3. Bucket name: `portfolio-builder-media` (or your preferred name)
4. Region: `us-east-1` (or your preferred region)
5. Block all public access: **UNCHECK** this (we need public access for images)
6. Enable "Bucket Versioning" (optional but recommended)
7. Click "Create bucket"

### Step 2: Create IAM User
1. Go to AWS Console → IAM
2. Click "Users" → "Create user"
3. User name: `portfolio-builder-s3`
4. Select "Attach policies directly"
5. Add these policies:
   - `AmazonS3FullAccess` (for simplicity)
   - OR create custom policy with minimal permissions:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:DeleteObject"
            ],
            "Resource": "arn:aws:s3:::portfolio-builder-media/*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket"
            ],
            "Resource": "arn:aws:s3:::portfolio-builder-media"
        }
    ]
}
```

6. Click "Create user"
7. Save the **Access key ID** and **Secret access key**

### Step 3: Configure Environment Variables
In your Render dashboard, add these environment variables:

```
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_STORAGE_BUCKET_NAME=portfolio-builder-media
AWS_S3_REGION_NAME=us-east-1
```

### Step 4: Deploy
1. Push the updated code to GitHub
2. Render will automatically redeploy with the new storage configuration
3. Test uploading images - they should now persist across service restarts

## Alternative: Free Cloud Storage Options
If you don't want to use AWS S3, consider these alternatives:

1. **Cloudinary** - Has a generous free tier
2. **Firebase Storage** - Google's free tier
3. **ImgBB** - Free image hosting with API
4. **GitHub as CDN** - Store images in GitHub releases

## Testing the Fix
1. Upload a profile picture or project image
2. Wait for Render to restart (happens periodically)
3. Check if the image is still visible
4. If images persist, the fix is working!

## Troubleshooting
- **Images still disappear**: Check if AWS credentials are correct
- **403 errors**: Ensure S3 bucket permissions allow public access
- **Upload failures**: Check AWS region and bucket name match

## Cost
AWS S3 is very cheap for image storage:
- ~$0.023 per GB per month
- A portfolio app with hundreds of images will cost less than $1/month
