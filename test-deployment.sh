#!/bin/bash

echo "🚀 Testing Auto-Deployment Setup"
echo "================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Step 1: Making a test change...${NC}"

# Add a timestamp to test deployment
echo "Auto-deployment test: $(date)" > DEPLOYMENT_TEST.md

echo -e "${YELLOW}Step 2: Committing and pushing...${NC}"

git add DEPLOYMENT_TEST.md
git commit -m "Test auto-deployment - $(date)"
git push

echo -e "${YELLOW}Step 3: Checking deployment URLs...${NC}"

# Check if services are responding
echo "Checking backend health..."
if curl -s https://portfolio-backend.onrender.com/health/ > /dev/null; then
    echo -e "${GREEN}✅ Backend is responding${NC}"
else
    echo -e "${RED}❌ Backend is not responding${NC}"
fi

echo "Checking frontend..."
if curl -s https://buildmyfolio.vercel.app > /dev/null; then
    echo -e "${GREEN}✅ Frontend is responding${NC}"
else
    echo -e "${RED}❌ Frontend is not responding${NC}"
fi

echo -e "${YELLOW}Step 4: Deployment URLs${NC}"
echo "Backend: https://portfolio-backend.onrender.com"
echo "Frontend: https://buildmyfolio.vercel.app"
echo ""
echo -e "${GREEN}✅ Test completed!${NC}"
echo "Check your Render and Vercel dashboards for deployment status."
echo "Both services should automatically deploy within 1-2 minutes."
