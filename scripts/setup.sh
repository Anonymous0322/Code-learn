#!/bin/bash
# CodeLearn Setup Script
# Run this script to initialize the development environment

set -e

echo "🚀 CodeLearn Setup Starting..."

# Check if Docker is running
if docker info > /dev/null 2>&1; then
    echo "✅ Docker is running"
else
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Start Docker containers
echo "📦 Starting Docker containers..."
docker-compose -f docker/docker-compose.dev.yml up -d

# Wait for database to be ready
echo "⏳ Waiting for database..."
sleep 5

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "🗄️ Running database migrations..."
npx prisma migrate dev --name init

# Seed database
echo "🌱 Seeding database..."
npx tsx scripts/seed.ts

# Install dependencies
echo "📥 Installing dependencies..."
npm install

echo "✅ Setup complete! Run 'npm run dev' to start the development server."
echo "🌐 Open http://localhost:3000 to see CodeLearn."
