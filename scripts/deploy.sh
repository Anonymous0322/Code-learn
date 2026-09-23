#!/bin/bash
# Deployment Script
# Run this to deploy CodeLearn to production

set -e

echo "🚀 Deploying CodeLearn to production..."

# Run tests
echo "🧪 Running tests..."
npm run test

# Build
echo "📦 Building application..."
npm run build

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
npx vercel --prod --token=$VERCEL_TOKEN

# Deploy worker to AWS ECS (if applicable)
echo "🚀 Deploying code executor to AWS ECS..."
aws ecs update-service \
  --cluster codelearn-workers \
  --service codelearner-exec \
  --force-new-deployment \
  --region us-east-1

echo "✅ Deployment complete!"
