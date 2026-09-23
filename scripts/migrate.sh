#!/bin/bash
# Database Migration Script

echo "Running database migrations..."
npx prisma migrate deploy

echo "Migrations complete."
