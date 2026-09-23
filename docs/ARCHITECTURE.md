# Architecture Documentation

## Overview
CodeLearn uses a full-stack Next.js architecture with PostgreSQL, Redis, and Docker-based code execution sandboxes.

## Layers
1. **Presentation Layer** — Next.js App Router with React Server Components
2. **API Layer** — Next.js API Routes with Zod validation
3. **Service Layer** — Business logic separated into dedicated services
4. **Data Layer** — Prisma ORM over PostgreSQL, Redis for caching
5. **Execution Layer** — BullMQ queues with Docker sandboxes for code execution

## Key Decisions
- **Monorepo**: Single repo with turbo for task orchestration
- **Server Components**: Default to server components for performance
- **TypeScript**: Strict mode throughout
- **PostgreSQL**: Relational data with JSONB flexibility
- **Docker Sandboxing**: Secure code execution isolation

See CODELEARN_FULL_PLAN.md for full details.
