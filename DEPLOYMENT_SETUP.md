# Automatic Deployment Setup for Portfolio Builder

This guide shows how to set up automatic deployment for both backend and frontend when you push to GitHub.

## Current Setup
- ✅ **Backend**: Auto-deploys to Render when you push to GitHub
- ✅ **Frontend**: Auto-deploys to Vercel when you push to GitHub
- ✅ **GitHub**: Connected to both services

## How It Works Currently

### 1. Backend (Render)
- **Trigger**: Push to GitHub main branch
- **Service**: Render web service
- **URL**: `https://portfolio-backend.onrender.com`
- **Auto-deploy**: ✅ Already configured

### 2. Frontend (Vercel)
- **Trigger**: Push to GitHub main branch  
- **Service**: Vercel
- **URL**: `https://buildmyfolio.vercel.app`
- **Auto-deploy**: ✅ Already configured

## What Happens When You Push

```bash
git add .
git commit -m "Your changes"
git push
```

### Automatic Process:
1. **GitHub**: Receives your push to main branch
2. **Render**: Detects changes, automatically builds and deploys backend
3. **Vercel**: Detects changes, automatically builds and deploys frontend
4. **Both services**: Update within 1-2 minutes

## Verify Auto-Deployment is Working

### 1. Check Render Dashboard
- Go to [Render Dashboard](https://dashboard.render.com)
- Find your "Portfolio Backend" service
- Check "Auto-Deploy" is enabled
- Should show "Connected to GitHub"

### 2. Check Vercel Dashboard  
- Go to [Vercel Dashboard](https://vercel.com/dashboard)
- Find your "Portfolio Builder" project
- Check "GitHub" integration is connected
- Should show "Connected to GitHub"

## Test Auto-Deployment

### Make a Small Change:
```bash
# Add a comment to test deployment
echo "# Testing auto-deployment" >> README.md
git add README.md
git commit -m "Test auto-deployment"
git push
```

### Expected Results:
1. **Render**: Should start building automatically (check dashboard)
2. **Vercel**: Should start building automatically (check dashboard)
3. **Both**: Should complete within 1-2 minutes
4. **URLs**: Should show your changes

## Troubleshooting Auto-Deployment

### If Backend Doesn't Deploy:
1. **Check Render**: Make sure service is connected to GitHub
2. **Check build log**: Look for errors in Render dashboard
3. **Check requirements.txt**: Make sure all dependencies are listed
4. **Reconnect**: Disconnect and reconnect GitHub in Render

### If Frontend Doesn't Deploy:
1. **Check Vercel**: Make sure project is connected to GitHub
2. **Check build log**: Look for errors in Vercel dashboard
3. **Check package.json**: Make sure all dependencies are listed
4. **Reconnect**: Disconnect and reconnect GitHub in Vercel

## Environment Variables

### Backend (Render):
Make sure these are set in Render dashboard:
```
DATABASE_URL=your_database_url
SECRET_KEY=your_secret_key
DEBUG=False
AWS_ACCESS_KEY_ID=your_aws_key (optional)
AWS_SECRET_ACCESS_KEY=your_aws_secret (optional)
```

### Frontend (Vercel):
Make sure this is set in Vercel dashboard:
```
VITE_API_URL=https://portfolio-backend.onrender.com
```

## Deployment URLs

### Production URLs:
- **Frontend**: https://buildmyfolio.vercel.app
- **Backend**: https://portfolio-backend.onrender.com
- **API**: https://portfolio-backend.onrender.com/api/

### Health Check:
- **Backend Health**: https://portfolio-backend.onrender.com/health/

## Best Practices

### 1. Always Test Before Pushing
```bash
# Test locally first
npm run dev  # Frontend
python manage.py runserver  # Backend
```

### 2. Use Descriptive Commit Messages
```bash
git commit -m "Fix user authentication issue"
git commit -m "Add new project upload feature"
```

### 3. Check Deployment Status
After pushing, check:
- Render dashboard for backend status
- Vercel dashboard for frontend status
- Both URLs to verify changes are live

## Advanced Setup (Optional)

### 1. Add GitHub Actions for Testing
Create `.github/workflows/test.yml`:
```yaml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Test Backend
        run: |
          cd backend
          pip install -r requirements.txt
          python manage.py test
      - name: Test Frontend  
        run: |
          cd frontend/portfolio-maker
          npm install
          npm test
```

### 2. Add Deployment Status Badges
Add to README.md:
```markdown
![Backend](https://img.shields.io/badge/backend-deployed-brightgreen)
![Frontend](https://img.shields.io/badge/frontend-deployed-brightgreen)
```

## Summary

Your automatic deployment is already set up! When you push to GitHub:

1. ✅ **Backend** automatically deploys to Render
2. ✅ **Frontend** automatically deploys to Vercel  
3. ✅ **Both services** update within 1-2 minutes
4. ✅ **No manual intervention** needed

Just push your changes and both services will update automatically!
