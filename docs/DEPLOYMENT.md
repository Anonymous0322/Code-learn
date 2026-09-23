# Deployment Guide

## Prerequisites
- Docker and Docker Compose installed
- Node.js 20+
- PostgreSQL database (or use Docker)
- Redis (or use Docker)

## Local Development
```bash
# Option 1: Docker
docker-compose -f docker/docker-compose.dev.yml up -d
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed
npm run dev

# Option 2: Native
docker-compose up -d db redis
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

## Staging Deployment
```bash
# Deploy to Vercel staging
npx vercel --team=codelearn --preview
```

## Production Deployment
```bash
# Deploy to Vercel production
npx vercel --prod --team=codelearn

# Or use the deploy script
./scripts/deploy.sh
```

## Environment Variables
Copy `.env.example` to `.env.production` and fill in values.

## Monitoring
- Sentry for error tracking
- Plausible for analytics
- UptimeRobot for uptime monitoring
- Docker logs for container monitoring

## Scaling
- Use Vercel's auto-scaling for web traffic
- Scale BullMQ workers independently
- Use read replicas for analytics queries
- Enable Cloudflare CDN

## Rollback
```bash
npx vercel --rollback --team=codelearn
```
