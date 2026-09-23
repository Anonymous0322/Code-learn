# Contributing to CodeLearn

## Getting Started
1. Clone the repository
2. Run `./scripts/setup.sh` or use Docker
3. Install dependencies: `npm install`
4. Start development: `npm run dev`

## Development Workflow
1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Write tests for new functionality
4. Run `npm run lint` and `npm run typecheck`
5. Run `npm run test`
6. Commit with conventional commits: `feat: add new feature`
7. Push and create a Pull Request

## Code Standards
- TypeScript strict mode
- ESLint + Prettier
- Use Tailwind CSS for styling
- Follow the design tokens in the project
- Write tests for all new components and APIs
- Use conventional commit messages

## Directory Structure
- `apps/web/` — Main Next.js application
- `apps/admin/` — Admin panel
- `packages/ui/` — Shared component library
- `packages/code-executor/` — Code execution logic
- `content/` — Course content JSON files
- `scripts/` — Setup, migration, and deployment scripts
- `tests/` — All test files
- `docs/` — Documentation

## Code Execution Security
All user code execution happens in sandboxed Docker containers. Never execute code on the main server process.

## Questions?
Open an issue or reach out to the project lead.
