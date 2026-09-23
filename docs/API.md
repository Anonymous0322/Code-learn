# API Documentation

## Base URL
- Development: `http://localhost:3000/api`
- Production: `https://codelearn.uz/api`

## Authentication
All protected routes require a Bearer token:
```
Authorization: Bearer <jwt-token>
```

## Endpoints

### Auth
- `POST /api/auth/register` — Create account
- `POST /api/auth/login` — Sign in
- `POST /api/auth/logout` — Sign out
- `GET /api/auth/me` — Get current user
- `POST /api/auth/reset-password` — Reset password

### Courses
- `GET /api/courses` — List all courses
- `GET /api/courses/:id` — Get course details
- `GET /api/courses/:id/levels` — Get course levels
- `GET /api/courses/:id/levels/:levelId/lessons` — Get lessons

### Code Execution
- `POST /api/execute` — Execute code (requires auth)

### Quiz
- `GET /api/quiz/:lessonId` — Get quiz questions
- `POST /api/quiz/submit` — Submit quiz answers

### Progress
- `GET /api/progress/:userId` — Get user progress
- `POST /api/progress/complete-lesson` — Mark lesson complete
- `POST /api/progress/complete-quiz` — Mark quiz complete

### Achievements
- `GET /api/achievements/earned` — Get earned badges
- `POST /api/achievements/check` — Check for new achievements

## Response Format
All responses follow this format:
```json
{
  "success": true,
  "data": {},
  "message": "string",
  "timestamp": "ISO8601"
}
```
