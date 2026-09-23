FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY package.json package.json

WORKDIR /app/apps/api
RUN npm ci

WORKDIR /app/apps/web
RUN npm ci

# Copy source
COPY . .

# Generate Prisma client
WORKDIR /app/apps/api
RUN npx prisma generate

# Build
WORKDIR /app/apps/web
RUN npm run build

WORKDIR /app/apps/api
RUN npm run build

# Start both servers
CMD sh -c "cd /app/apps/api && npm run start & cd /app/apps/web && npm run start"
