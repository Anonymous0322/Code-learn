# CODELEARN — Programming Learning Platform
## Full Product Plan + Architecture + OpenCode AI Agent Prompts

**Version:** 1.0  
**Project Working Name:** CodeLearn  
**Languages:** Uzbek / Russian / English  
**Initial Programming Languages:** HTML, CSS, JavaScript, Python  
**Document Date:** September 2026

---

## TABLE OF CONTENTS

1. [Project Vision](#1-project-vision)
2. [Target Audience](#2-target-audience)
3. [Product Features](#3-product-features)
4. [User Flows](#4-user-flows)
5. [Content Structure & Curriculum](#5-content-structure--curriculum)
6. [Technical Architecture](#6-technical-architecture)
7. [Database Design](#7-database-design)
8. [API Design](#8-api-design)
9. [UI/UX Design System](#9-uiux-design-system)
10. [Project File Structure](#10-project-file-structure)
11. [Deployment & DevOps](#11-deployment--devops)
12. [OpenCode AI Agent Prompts](#12-opencode-ai-agent-prompts)
13. [Roadmap & Milestones](#13-roadmap--milestones)
14. [Risk Assessment](#14-risk-assessment)

---

## 1. PROJECT VISION

Build a professional, responsive, multilingual programming-learning web platform where absolute beginners can register, choose a programming language, start at Level 0, learn concepts step by step, see simple explanations and examples, practice code interactively, complete quizzes/tasks, track progress, and gradually move to more advanced levels and projects.

**Core Values:**
- **Accessibility:** Anyone can start from zero — no prior knowledge required
- **Multilingual:** Uzbek, Russian, English interface and content
- **Scalable:** Architecture supports adding new technologies over time
- **Professional:** Premium dark edtech aesthetic — no childish interfaces
- **Interactive:** Write code, see results, get feedback — learn by doing

**Initial Tech Stack (Frontend Courses):**
- HTML → Structure the web
- CSS → Style the web
- JavaScript → Make the web alive
- Python → General-purpose programming

**Future Technologies (Planned):**
- SQL → Databases
- Java → Enterprise applications
- C++ → Systems programming
- C# → Game development / .NET
- React → Modern frontend frameworks
- TypeScript → Typed JavaScript
- Git/GitHub → Version control & collaboration

---

## 2. TARGET AUDIENCE

| Segment | Description | Primary Language |
|---------|-------------|-----------------|
| Beginners | Never written code, ages 16–30 | Uzbek, Russian |
| Students | School/university students learning CS | Russian, English |
| Career Switchers | Professionals transitioning to tech | English, Russian |
| Hobbyists | Self-learners exploring programming | Uzbek, Russian, English |

**Geographic Focus:** Uzbekistan → CIS → International  
**Language Strategy:** UI/UX in all 3 languages. Course content initially in Russian with Uzbek translations, English added as platform matures.

---

## 3. PRODUCT FEATURES

### 3.1 Core Features

| Feature | Description | Priority |
|---------|-------------|----------|
| **User Authentication** | Register, login, email verification, password reset | P0 |
| **Language Selection** | Choose from available programming languages | P0 |
| **Lesson System** | Step-by-step lessons with theory + examples | P0 |
| **Code Playground** | Browser-based code editor with live execution | P0 |
| **Quiz System** | Multiple choice, fill-in-the-blank, code challenges | P0 |
| **Progress Tracking** | Visual progress bar, completed lessons, stats | P0 |
| **Achievement System** | Badges, streaks, certificates | P1 |
| **Dark/Light Theme** | Toggle between themes | P1 |
| **Multilingual UI** | Interface in Uzbek/Russian/English | P0 |
| **Responsive Design** | Mobile, tablet, desktop | P0 |

### 3.2 Advanced Features (Phase 2)

| Feature | Description | Priority |
|---------|-------------|----------|
| **Community Forum** | Discussion, Q&A | P2 |
| **Mentor Matching** | Connect with advanced learners | P2 |
| **Project-Based Learning** | Capstone projects per language | P2 |
| **Leaderboard** | Competitive rankings | P3 |
| **Mobile App** | React Native companion app | P3 |
| **API Course** | REST, GraphQL | P3 |
| **Real-time Collaboration** | Pair programming | P3 |

### 3.3 Feature Details

#### 3.3.1 Code Playground
- Syntax-highlighted code editor
- Run button executes code server-side (sandboxed)
- Output displayed below editor
- Supports multiple languages
- Auto-indentation and bracket matching
- Error messages with line numbers
- Console output panel

#### 3.3.2 Progress System
- Per-course progress percentage (0–100%)
- Per-level completion status
- Time spent tracking
- Streak counter (consecutive days)
- Achievement badges
- Certificate generation upon course completion

#### 3.3.3 Quiz System
- Multiple choice questions
- Code snippet completion
- True/false questions
- Drag-and-drop (advanced)
- Timer for timed quizzes
- Instant feedback with explanations
- Retry mechanism

---

## 4. USER FLOWS

### 4.1 New User Onboarding Flow
```
Landing Page → "Start Learning" Button → Registration Modal
→ Choose Preferred Language (UI) → Choose First Language (HTML/CSS/JS/Python)
→ Welcome Tutorial (Level 0) → First Lesson → Interactive Example → Quiz
→ Progress Saved → Continue Learning
```

### 4.2 Daily Learning Flow
```
Login → Dashboard (Today's Lesson) → Start Lesson → Read Theory
→ View Code Example → Open Code Playground → Practice
→ Complete Quiz → See Results → Unlock Next Lesson
→ Track Progress → Earn Badge/Achievement
```

### 4.3 Code Execution Flow
```
Open Code Playground → Select Language → Write Code
→ Click "Run" → Code Sent to Server → Sandbox Execution
→ Result Returned → Display Output/Error → User Fixes Code
→ Submit Answer (if part of lesson) → Feedback Given
```

---

## 5. CONTENT STRUCTURE & CURRICULUM

### 5.1 Curriculum Architecture

Each programming language follows a structured hierarchy:
```
Language
  ├── Level 0: Absolute Basics
  ├── Level 1: Fundamentals
  ├── Level 2: Intermediate
  ├── Level 3: Advanced
  ├── Level 4: Projects & Real-World
  └── Capstone Project

Each Level contains:
  ├── Lesson 1: [Topic Name]
  │   ├── Theory (text + diagrams)
  │   ├── Example Code (readable, commented)
  │   ├── Interactive Exercise
  │   └── Quiz (5–10 questions)
  ├── Lesson 2: [Topic Name]
  └── ...
```

### 5.2 HTML Curriculum (12 Lessons, 4 Levels)

| Level | Lesson | Title |
|-------|--------|-------|
| 0 | 1 | What is the Web? |
| 0 | 2 | What is HTML? |
| 1 | 3 | HTML Structure & Tags |
| 1 | 4 | Text Formatting |
| 2 | 5 | Images, Links & Media |
| 2 | 6 | Lists & Tables |
| 3 | 7 | Forms & Input |
| 3 | 8 | Semantic HTML |
| 4 | 9 | Accessibility |
| 4 | 10 | HTML5 Features |
| 4 | 11 | SEO Basics |
| 4 | 12 | Mini Project: Personal Page |

### 5.3 CSS Curriculum (14 Lessons, 4 Levels)

| Level | Lesson | Title |
|-------|--------|-------|
| 0 | 1 | What is CSS? |
| 0 | 2 | How CSS Works with HTML |
| 1 | 3 | Selectors & Properties |
| 1 | 4 | Colors & Backgrounds |
| 2 | 5 | Box Model |
| 2 | 6 | Flexbox |
| 3 | 7 | Grid Layout |
| 3 | 8 | Responsive Design |
| 3 | 9 | Animations & Transitions |
| 4 | 10 | CSS Variables |
| 4 | 11 | Preprocessors Intro |
| 4 | 12 | Frameworks Overview |
| 4 | 13 | Performance |
| 4 | 14 | Mini Project: Portfolio Page |

### 5.4 JavaScript Curriculum (16 Lessons, 5 Levels)

| Level | Lesson | Title |
|-------|--------|-------|
| 0 | 1 | What is JavaScript? |
| 0 | 2 | Your First Script |
| 1 | 3 | Variables & Data Types |
| 1 | 4 | Operators & Expressions |
| 2 | 5 | Conditions & Logic |
| 2 | 6 | Loops |
| 3 | 7 | Functions |
| 3 | 8 | Arrays & Objects |
| 3 | 9 | DOM Manipulation |
| 3 | 10 | Events |
| 4 | 11 | ES6+ Features |
| 4 | 12 | Async/Await |
| 4 | 13 | Fetch API |
| 4 | 14 | Error Handling |
| 4 | 15 | Modules |
| 4 | 16 | Mini Project: Interactive Website |

### 5.5 Python Curriculum (18 Lessons, 5 Levels)

| Level | Lesson | Title |
|-------|--------|-------|
| 0 | 1 | What is Python? |
| 0 | 2 | Your First Program |
| 1 | 3 | Variables & Data Types |
| 1 | 4 | Operators |
| 2 | 5 | Conditionals |
| 2 | 6 | Loops |
| 3 | 7 | Functions |
| 3 | 8 | Lists & Tuples |
| 3 | 9 | Dictionaries & Sets |
| 3 | 10 | File Handling |
| 4 | 11 | OOP Basics |
| 4 | 12 | Modules & Packages |
| 4 | 13 | Virtual Environments |
| 4 | 14 | Error Handling |
| 4 | 15 | Libraries Overview |
| 4 | 16 | Working with APIs |
| 4 | 17 | Intro to Data Science |
| 4 | 18 | Mini Project: Calculator App |

---

## 6. TECHNICAL ARCHITECTURE

### 6.1 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                          │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────────────┐  │
│  │   Next.js │  │  CodeMirror   │  │   Zustand Store       │  │
│  │  (React)  │  │  Editor       │  │   (State Management)  │  │
│  └────┬─────┘  └──────┬───────┘  └───────────┬───────────┘  │
│       │               │                      │              │
│       └───────────────┼──────────────────────┘              │
│                       │                                      │
├───────────────────────┼──────────────────────────────────────┤
│                  API Gateway / Reverse Proxy                  │
│                    (Nginx / Cloudflare)                      │
├───────────────────────┼──────────────────────────────────────┤
│                     SERVER LAYER                            │
│  ┌────────────────────┼──────────────────────────────────┐  │
│  │              Node.js / Express / Next.js API            │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │  │
│  │  │ Auth     │ │ Lessons  │ │ Code     │ │ Quiz     │ │  │
│  │  │ Service  │ │ Service  │ │ Executor │ │ Service  │ │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ │  │
│  └────────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                    DATABASE LAYER                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  PostgreSQL  │  │   Redis      │  │  MongoDB (logs)  │  │
│  │  (Primary)   │  │  (Cache)     │  │  (Analytics)     │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                 INFRASTRUCTURE LAYER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  Docker      │  │  GitHub      │  │  Vercel/       │  │
│  │  Containers  │  │  Actions     │  │  AWS ECS         │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 Technology Choices

#### Frontend
| Technology | Purpose | Reason |
|-----------|---------|--------|
| **Next.js 14+** | Framework | SSR/SSG/API routes, React ecosystem |
| **React 18** | UI Library | Component-based, large ecosystem |
| **TypeScript** | Type Safety | Catches errors early, better DX |
| **Tailwind CSS** | Styling | Utility-first, rapid development |
| **Framer Motion** | Animations | Smooth micro-animations |
| **CodeMirror 6** | Code Editor | Battle-tested, multi-language support |
| **Zustand** | State Management | Lightweight, simple API |
| **i18next** | Internationalization | Supports Uzbek, Russian, English |
| **React Query (TanStack)** | Server State | Caching, synchronization |
| **NextAuth.js** | Authentication | OAuth, JWT, session management |
| **React Hot Toast** | Notifications | Beautiful toast messages |

#### Backend
| Technology | Purpose | Reason |
|-----------|---------|--------|
| **Next.js API Routes** | Serverless/Server API | Full-stack in one framework |
| **Node.js** | Runtime | Non-blocking I/O, JavaScript everywhere |
| **JSDelivr/Skulpt (server-side)** | Code Execution | Python via Pyodide/Skulpt, JS via JSDelivr |
| **Docker** | Containerization | Consistent environments |
| **BullMQ** | Job Queue | Background code execution tasks |

#### Database
| Technology | Purpose | Reason |
|-----------|---------|--------|
| **PostgreSQL** | Primary Database | Relational, robust, JSON support |
| **Redis** | Cache & Sessions | Fast key-value store |
| **MongoDB Atlas** | Analytics/Logs | Document store for unstructured data |

#### Infrastructure
| Technology | Purpose | Reason |
|-----------|---------|--------|
| **Vercel** | Hosting | Optimized for Next.js |
| **Docker** | Containerization | Reproducible builds |
| **GitHub Actions** | CI/CD | Automated testing & deployment |
| **Cloudflare** | CDN & DNS | Global edge network |

### 6.3 Architecture Principles

1. **Monorepo Strategy:** Single repository with `apps/` and `packages/` directories
2. **Feature-Based Organization:** Code organized by feature, not by type
3. **Layered Architecture:** Presentation → Business Logic → Data Access
4. **API-First Design:** All functionality exposed via REST/GraphQL APIs
5. **Serverless Where Possible:** Cost-effective scaling for variable loads
6. **Progressive Enhancement:** Core features work without JavaScript
7. **Security-First:** Input validation, parameterized queries, sandboxed execution
8. **Accessibility (a11y):** WCAG 2.1 AA compliance

### 6.4 Data Flow

```
User Request → API Route → Middleware (Auth) → Service Layer
    → Data Layer → Database → Response → Serialization → Client

Code Execution Flow:
User Code → POST /api/execute → Queue (BullMQ) → Sandbox Container
    → Execution → Result → Redis Cache → Response to Client
```

---

## 7. DATABASE DESIGN

### 7.1 ERD Overview

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    users     │     │   courses   │     │   levels    │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ id (PK)      │────│ id (PK)     │────│ id (PK)     │
│ email        │    │ title       │    │ title       │
│ password_hash│    │ language    │    │ course_id(FK)│
│ name         │    │ description │    │ order_index │
│ language_pref│    │ icon_url    │    │ content_json│
│ ui_language  │    │ difficulty  │    └─────────────┘
│ streak       │    └─────────────┘
│ total_xp     │
└──────┬──────┘
       │
┌──────▼──────────┐     ┌──────────────┐     ┌──────────────┐
│  user_progress  │     │   lessons    │     │    quizzes   │
├─────────────────┤     ├──────────────┤     ├──────────────┤
│ id (PK)         │     │ id (PK)      │     │ id (PK)      │
│ user_id (FK)    │     │ level_id(FK) │     │ lesson_id(FK)│
│ level_id (FK)   │     │ title        │     │ questions    │
│ completed       │     │ content      │     │ correct_ans  │
│ xp_earned       │     │ order_index  │     │ time_limit   │
│ last_activity   │     │ difficulty   │     └──────────────┘
└─────────────────┘     └──────┬───────┘
                               │
                        ┌──────▼───────┐     ┌──────────────┐
                        │   exercises  │     │  achievements│
                        ├──────────────┤     ├──────────────┤
                        │ id (PK)      │     │ id (PK)      │
                        │ lesson_id(FK)│     │ id (PK)      │
                        │ code_template│     │ name         │
                        │ user_code    │     │ description  │
                        │ user_solution│     │ icon_url     │
                        │ is_correct   │     │ criteria     │
                        └──────────────┘     └──────────────┘
```

### 7.2 Key Tables

#### `users`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| email | VARCHAR(255) | Unique, indexed |
| password_hash | VARCHAR(255) | BCrypt hashed |
| name | VARCHAR(100) | Display name |
| preferred_language | ENUM('uz','ru','en') | UI language |
| course_language | VARCHAR(10) | Currently learning |
| streak | INTEGER | Consecutive days |
| total_xp | INTEGER | Total experience points |
| avatar_url | VARCHAR(500) | Profile image |
| is_verified | BOOLEAN | Email verified |
| created_at | TIMESTAMP | Account creation |
| updated_at | TIMESTAMP | Last update |

#### `courses`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| title | VARCHAR(100) | "HTML", "Python", etc. |
| language_code | VARCHAR(10) | Programming language |
| description | TEXT | Course overview |
| icon_url | VARCHAR(500) | Language logo |
| difficulty | ENUM('beginner','intermediate','advanced') | Level |
| is_active | BOOLEAN | Available for enrollment |

#### `user_progress`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID (FK) | Reference to users |
| course_id | UUID (FK) | Reference to courses |
| level_id | UUID (FK) | Current level |
| lesson_completed | INTEGER[] | Array of completed lesson IDs |
| quiz_scores | JSONB | Quiz attempt results |
| xp_earned | INTEGER | Points earned |
| started_at | TIMESTAMP | When course started |
| completed_at | TIMESTAMP | When course finished (nullable) |

### 7.3 Database Optimization
- **Indexes:** Email, foreign keys, created_at timestamps
- **Connection Pooling:** PgBouncer for PostgreSQL
- **Read Replicas:** For analytics queries
- **JSONB Columns:** For flexible content storage
- **Row-Level Security:** For multi-tenant data isolation

---

## 8. API DESIGN

### 8.1 API Structure

All API routes follow RESTful conventions under `/api/`:

```
/api/auth
  POST   /register
  POST   /login
  POST   /logout
  GET    /me
  POST   /reset-password
  POST   /verify-email

/api/courses
  GET    /courses
  GET    /courses/:id
  GET    /courses/:id/levels
  GET    /courses/:id/levels/:levelId/lessons
  GET    /courses/:id/levels/:levelId/lessons/:lessonId

/api/playground
  POST   /execute
  POST   /save-snippet
  GET    /snippets/:id

/api/quiz
  GET    /quiz/:lessonId
  POST   /submit
  GET    /results/:quizId

/api/progress
  GET    /progress/:userId
  POST   /complete-lesson
  POST   /complete-quiz
  GET    /stats/:userId

/api/achievements
  GET    /earned
  POST   /check

/api/admin
  GET    /courses
  POST   /courses
  PUT    /courses/:id
  DELETE  /courses/:id
  POST   /lessons
```

### 8.2 Request/Response Format

**Standard Response:**
```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully",
  "timestamp": "2026-09-23T10:00:00Z"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": ["email must be a valid email address"]
  }
}
```

### 8.3 Code Execution API

**Request:**
```json
{
  "language": "python",
  "code": "print('Hello, CodeLearn!')",
  "timeout": 5000,
  "userId": "uuid-here"
}
```

**Response:**
```json
{
  "success": true,
  "output": "Hello, CodeLearn!\n",
  "error": null,
  "executionTime": 0.12,
  "memoryUsed": "2.4MB",
  "status": "success"
}
```

---

## 9. UI/UX DESIGN SYSTEM

### 9.1 Design Tokens

```css
/* === Colors === */
:root {
  /* Background */
  --bg-primary: #0a0e1a;
  --bg-secondary: #111827;
  --bg-card: rgba(17, 24, 39, 0.8);
  --bg-glass: rgba(255, 255, 255, 0.05);

  /* Neon Accents */
  --neon-blue: #3b82f6;
  --neon-cyan: #06b6d4;
  --neon-purple: #8b5cf6;
  --neon-pink: #ec4899;
  --neon-green: #10b981;
  --neon-yellow: #f59e0b;

  /* Text */
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;

  /* Borders */
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-glow: rgba(59, 130, 246, 0.3);

  /* Gradients */
  --gradient-primary: linear-gradient(135deg, #3b82f6, #8b5cf6);
  --gradient-neon: linear-gradient(135deg, #06b6d4, #3b82f6, #8b5cf6);
  --gradient-hero: linear-gradient(180deg, #0a0e1a 0%, #1a1f3a 100%);

  /* Shadows */
  --shadow-glow-blue: 0 0 20px rgba(59, 130, 246, 0.15);
  --shadow-glow-purple: 0 0 20px rgba(139, 92, 246, 0.15);
  --shadow-card: 0 4px 24px rgba(0, 0, 0, 0.4);

  /* Typography */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 2rem;
  --text-4xl: 2.5rem;

  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;

  /* Border Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-full: 9999px;
}
```

### 9.2 Component Library

| Component | Description | Props |
|-----------|-------------|-------|
| `Card` | Glassmorphism card with hover glow | `variant`, `className`, `children` |
| `Button` | Neon-accent CTA button | `variant`, `size`, `disabled`, `loading` |
| `Badge` | Achievement/level indicator | `text`, `color`, `size` |
| `ProgressRing` | Circular progress indicator | `percentage`, `size`, `color` |
| `CodeEditor` | Embedded CodeMirror instance | `language`, `code`, `onChange`, `readOnly` |
| `LessonCard` | Course/lesson navigation card | `title`, `description`, `level`, `isCompleted` |
| `LanguageCard` | Programming language selection card | `language`, `logo`, `level`, `description` |
| `Navbar` | Main navigation with language switcher | `user`, `onLanguageChange` |
| `Footer` | Site footer with links | `variant` |
| `Modal` | Glassmorphism overlay dialog | `isOpen`, `onClose`, `title`, `children` |
| `Toast` | Notification message | `type`, `message`, `duration` |
| `Typography` | Text with consistent styling | `variant`, `as`, `className`, `children` |

### 9.3 Page Structure

| Page | Description | Key Elements |
|------|-------------|-------------|
| `/` | Landing Page | Hero section, language cards, features, CTA |
| `/auth/login` | Login Page | Form with validation, social login |
| `/auth/register` | Registration Page | Multi-step form |
| `/dashboard` | User Dashboard | Progress overview, daily lesson, stats |
| `/courses` | Course Catalog | Language cards with logos, difficulty badges |
| `/courses/:id` | Course Detail | Curriculum overview, level selector |
| `/courses/:id/levels/:levelId` | Level View | Lesson list, progress within level |
| `/courses/:id/levels/:levelId/lessons/:lessonId` | Lesson View | Theory, code example, playground, quiz |
| `/playground` | Standalone Code Editor | Full IDE-like experience |
| `/achievements` | Achievements Page | Badge gallery, streaks |
| `/profile` | User Profile | Stats, certificates, settings |

### 9.4 Motion Design

- **Page transitions:** 300ms ease-in-out
- **Card hover:** 200ms scale(1.02) + box-shadow glow
- **Progress fill:** 800ms ease-out with spring physics
- **Button press:** 100ms scale(0.97)
- **Toast entrance:** 400ms slide from right
- **Code editor cursor:** Blinking 1s interval
- **Particle background:** Subtle floating dots on hero section
- **Loading skeleton:** Shimmer animation

### 9.5 Accessibility

- WCAG 2.1 AA contrast ratios (minimum 4.5:1 for text)
- Keyboard navigation throughout
- Screen reader support (ARIA labels, roles)
- Focus indicators on interactive elements
- Reduced motion preference respected
- High contrast mode support

---

## 10. PROJECT FILE STRUCTURE

```
codelearn/
├── apps/
│   ├── web/                          # Main Next.js application
│   │   ├── src/
│   │   │   ├── app/                  # Next.js 14 App Router
│   │   │   │   ├── layout.tsx        # Root layout with providers
│   │   │   │   ├── page.tsx          # Landing page
│   │   │   │   ├── globals.css      # Tailwind + design tokens
│   │   │   │   ├── auth/
│   │   │   │   │   ├── login/
│   │   │   │   │   ├── register/
│   │   │   │   │   └── callback/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── courses/
│   │   │   │   │   ├── [id]/
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   ├── levels/
│   │   │   │   │   │   │   └── [levelId]/
│   │   │   │   │   │   │       └── page.tsx
│   │   │   │   │   │   └── lessons/
│   │   │   │   │   │       └── [lessonId]/
│   │   │   │   │   │           └── page.tsx
│   │   │   │   ├── playground/
│   │   │   │   ├── achievements/
│   │   │   │   ├── profile/
│   │   │   │   └── api/              # API routes
│   │   │   │       ├── auth/
│   │   │   │       ├── courses/
│   │   │   │       ├── execute/
│   │   │   │       ├── quiz/
│   │   │   │       ├── progress/
│   │   │   │       └── achievements/
│   │   │   ├── components/
│   │   │   │   ├── ui/               # Base UI components
│   │   │   │   │   ├── Card.tsx
│   │   │   │   │   ├── Button.tsx
│   │   │   │   │   ├── Badge.tsx
│   │   │   │   │   ├── Modal.tsx
│   │   │   │   │   ├── Toast.tsx
│   │   │   │   │   ├── ProgressRing.tsx
│   │   │   │   │   └── Typography.tsx
│   │   │   │   ├── layout/           # Layout components
│   │   │   │   │   ├── Navbar.tsx
│   │   │   │   │   ├── Footer.tsx
│   │   │   │   │   ├── Sidebar.tsx
│   │   │   │   │   └── LanguageSwitcher.tsx
│   │   │   │   ├── courses/          # Course-specific components
│   │   │   │   │   ├── CourseCard.tsx
│   │   │   │   │   ├── LanguageCard.tsx
│   │   │   │   │   ├── LessonCard.tsx
│   │   │   │   │   ├── LevelProgress.tsx
│   │   │   │   │   └── CurriculumSidebar.tsx
│   │   │   │   ├── editor/           # Code editor components
│   │   │   │   │   ├── CodeEditor.tsx
│   │   │   │   │   ├── OutputPanel.tsx
│   │   │   │   │   ├── EditorToolbar.tsx
│   │   │   │   │   └── FileExplorer.tsx
│   │   │   │   ├── quiz/             # Quiz components
│   │   │   │   │   ├── QuizCard.tsx
│   │   │   │   │   ├── QuizQuestion.tsx
│   │   │   │   │   └── QuizResults.tsx
│   │   │   │   └── shared/           # Shared components
│   │   │   │       ├── Loading.tsx
│   │   │   │       ├── ErrorBoundary.tsx
│   │   │   │       ├── ParticleBackground.tsx
│   │   │   │       └── ProtectedRoute.tsx
│   │   │   ├── lib/
│   │   │   │   ├── db/               # Database connection & queries
│   │   │   │   │   ├── client.ts
│   │   │   │   │   ├── queries/
│   │   │   │   │   └── migrations/
│   │   │   │   ├── api/              # API utility functions
│   │   │   │   │   ├── client.ts
│   │   │   │   │   └── endpoints.ts
│   │   │   │   ├── auth/             # Auth utilities
│   │   │   │   │   ├── session.ts
│   │   │   │   │   └── tokens.ts
│   │   │   │   ├── code/             # Code execution utilities
│   │   │   │   │   ├── executor.ts
│   │   │   │   │   └── sandbox.ts
│   │   │   │   ├── i18n/             # Internationalization
│   │   │   │   │   ├── config.ts
│   │   │   │   │   ├── resources/
│   │   │   │   │   │   ├── en.json
│   │   │   │   │   │   ├── ru.json
│   │   │   │   │   │   └── uz.json
│   │   │   │   │   └── middleware.ts
│   │   │   │   └── utils/            # General utilities
│   │   │   │       ├── format.ts
│   │   │   │       ├── validation.ts
│   │   │   │       └── helpers.ts
│   │   │   ├── hooks/                # Custom React hooks
│   │   │   │   ├── useAuth.ts
│   │   │   │   ├── useProgress.ts
│   │   │   │   ├── useQuiz.ts
│   │   │   │   ├── useCodeExecute.ts
│   │   │   │   ├── useLanguage.ts
│   │   │   │   └── useToast.ts
│   │   │   ├── store/                # Zustand stores
│   │   │   │   ├── authStore.ts
│   │   │   │   ├── courseStore.ts
│   │   │   │   ├── editorStore.ts
│   │   │   │   └── uiStore.ts
│   │   │   ├── types/                # TypeScript types
│   │   │   │   ├── user.ts
│   │   │   │   ├── course.ts
│   │   │   │   ├── lesson.ts
│   │   │   │   ├── quiz.ts
│   │   │   │   └── code.ts
│   │   │   └── middleware.ts          # Next.js middleware
│   │   ├── public/
│   │   │   ├── images/
│   │   │   │   ├── logos/
│   │   │   │   ├── heroes/
│   │   │   │   └── icons/
│   │   │   ├── fonts/
│   │   │   └── favicon.ico
│   │   ├── next.config.js
│   │   ├── tailwind.config.ts
│   │   ├── tsconfig.json
│   │   ├── middleware.ts
│   │   └── package.json
│   │
│   └── admin/                        # Admin panel (future)
│       └── ...
│
├── packages/
│   ├── ui/                           # Shared UI component library
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── tokens/
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── config/                       # Shared ESLint, TypeScript, etc.
│   │   └── ...
│   │
│   └── code-executor/                # Shared code execution logic
│       ├── src/
│       │   ├── executors/
│       │   │   ├── javascript.ts
│       │   │   ├── python.ts
│       │   │   └── html.ts
│       │   └── index.ts
│       └── package.json
│
├── docker/
│   ├── Dockerfile                    # Main application
│   ├── Dockerfile.admin
│   ├── docker-compose.yml
│   ├── docker-compose.dev.yml
│   └── nginx/
│       └── nginx.conf
│
├── scripts/
│   ├── setup.sh                      # Initial setup script
│   ├── migrate.sh                    # Database migrations
│   ├── seed.ts                       # Seed data for development
│   └── deploy.sh                     # Deployment script
│
├── content/                          # Course content (JSON files)
│   ├── html/
│   │   ├── levels.json
│   │   ├── lessons/
│   │   │   ├── level-0/
│   │   │   ├── level-1/
│   │   │   ├── level-2/
│   │   │   └── level-3/
│   │   └── quizzes.json
│   ├── css/
│   │   └── ...
│   ├── javascript/
│   │   └── ...
│   └── python/
│       └── ...
│
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│   └── performance/
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── CONTRIBUTING.md
│   └── DEPLOYMENT.md
│
├── .env.example
├── .eslintrc.js
├── .prettierrc
├── .gitignore
├── package.json
├── tsconfig.json
├── turbo.json                       # Turborepo configuration
└── README.md
```

---

## 11. DEPLOYMENT & DEVOPS

### 11.1 CI/CD Pipeline

```
Push to Main → GitHub Actions
    → Lint & Type Check
    → Run Unit Tests
    → Run Integration Tests
    → Build Application
    → Deploy to Staging
    → Run E2E Tests
    → Manual Approval
    → Deploy to Production (Vercel)
    → Run Health Checks
    → Notify Slack/Discord
```

### 11.2 Environment Configuration

| Environment | Variables | Database | Storage |
|------------|-----------|----------|---------|
| **Development** | `.env.local` | Local PostgreSQL | Local |
| **Staging** | `.env.staging` | Neon/RDS | Vercel Blob |
| **Production** | `.env.production` | Neon/RDS (HA) | Vercel Blob |

### 11.3 Docker Compose (Development)

```yaml
version: '3.8'
services:
  app:
    build: ./docker
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/codelearn
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    volumes:
      - ./apps/web:/app
      - /app/node_modules

  db:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: codelearn
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

### 11.4 Monitoring & Observability
- **Error Tracking:** Sentry for production errors
- **Analytics:** Plausible (privacy-focused) or Mixpanel
- **Uptime Monitoring:** UptimeRobot
- **Performance:** Lighthouse CI
- **Logging:** Structured logging with Winston/Pino

---

## 12. OPENCODE AI AGENT PROMPTS

### 12.1 Agent: `code-learn-frontend-developer`

**Role:** Full-stack frontend developer specializing in Next.js/React applications with a focus on education platforms.

```
You are a senior full-stack frontend developer working on CodeLearn, a multilingual programming learning platform.

PROJECT CONTEXT:
- Framework: Next.js 14+ with App Router and TypeScript
- Styling: Tailwind CSS with CSS custom properties (design tokens)
- State Management: Zustand for client state, React Query for server state
- Animations: Framer Motion for all micro-animations
- Editor: CodeMirror 6 for code editing
- i18n: i18next with Uzbek, Russian, English support
- Auth: NextAuth.js
- Design: Premium dark theme with neon blue/cyan/purple accents, glassmorphism, rounded cards

ARCHITECTURE PRINCIPLES:
1. Always use the App Router pattern (app/ directory)
2. Server Components by default, Client Components when needed (use "use client")
3. Type everything strictly with TypeScript
4. Use functional components with hooks
5. All API calls go through a centralized API client
6. Use shadcn/ui patterns as reference for component styling
7. Content is stored in JSON files under /content/ — never hardcoded
8. All components must be responsive and accessible

DESIGN SYSTEM RULES:
- Background: dark navy (#0a0e1a)
- Accents: neon blue (#3b82f6), cyan (#06b6d4), purple (#8b5cf6)
- Cards: glassmorphism with subtle borders and glow effects on hover
- Typography: Inter for UI, JetBrains Mono for code
- Border radius: 12px minimum for cards, 9999px for pills/badges
- Animations: smooth, professional — 200-400ms transitions
- NEVER use bright/garish colors, NEVER use generic LMS blue

CODING STANDARDS:
- No inline styles except for dynamic values
- Use Tailwind classes exclusively for styling
- Component files must have corresponding test files
- All components must have proper ARIA attributes
- Error boundaries around all async operations
- Loading states for every async action
- Never use alert(), prompt(), or confirm()
- Use React Hot Toast for all user notifications

When writing code, always provide:
1. The complete component with imports
2. Proper TypeScript interfaces/types
3. Error handling
4. Loading states
5. Responsive design considerations
6. Accessibility attributes
7. Comments only when the logic is non-obvious

LANGUAGE FILES:
- When creating content files, they must be in /content/{language}/{type}.json format
- Each lesson must include: id, title, description, theory, example_code, exercises, quiz
- Content must be beginner-friendly with step-by-step explanations

Always ask clarifying questions before making architectural decisions. Prioritize type safety and clean code over speed.
```

### 12.2 Agent: `code-learn-backend-developer`

**Role:** Backend developer specializing in Next.js API routes, database design, and secure code execution.

```
You are a senior backend developer working on CodeLearn, a programming learning platform.

PROJECT CONTEXT:
- Backend: Next.js API Routes (serverless functions)
- Database: PostgreSQL with Prisma ORM, Redis for caching
- Job Queue: BullMQ for code execution tasks
- Auth: NextAuth.js with JWT sessions
- Code Execution: Sandboxed containers running user code safely
- File Storage: Vercel Blob for user avatars and generated content

API DESIGN RULES:
1. All routes under /app/api/ directory
2. Use NextRequest and NextResponse for request/response handling
3. Always validate input with Zod before processing
4. Always authenticate routes that need user data (except public routes)
5. Return standardized JSON responses with { success, data, message, timestamp }
6. Use HTTP status codes correctly (200, 201, 400, 401, 403, 404, 500)
7. Rate limit all authentication endpoints
8. Implement proper CORS handling

DATABASE RULES:
1. Use Prisma for all database operations
2. Always define proper relations between models
3. Use indexes for frequently queried fields
4. Never expose passwords or sensitive data in API responses
5. Use transactions for multi-step operations
6. Implement soft deletes where appropriate
7. Use PostgreSQL JSONB columns for flexible data

CODE EXECUTION RULES:
1. NEVER execute user code on the main server process
2. Always use sandboxed environments (Docker containers or serverless functions)
3. Set strict timeout limits (max 10 seconds)
4. Set memory limits (max 256MB)
5. Block dangerous operations (file system access, network calls, process spawning)
6. Always return execution time and memory usage in results
7. Queue execution tasks via BullMQ for scalability
8. Cache frequent code execution results in Redis

SECURITY RULES:
1. Validate ALL user input server-side
2. Use parameterized queries to prevent SQL injection
3. Hash passwords with bcrypt (min 12 rounds)
4. Use secure cookies for session management
5. Implement CSRF protection
6. Sanitize all output to prevent XSS
7. Rate limit API endpoints
8. Never expose API keys in client-side code
9. Use environment variables for all secrets
10. Audit log all administrative actions

When writing API routes, always provide:
1. The complete route handler with proper HTTP method handling
2. Input validation with Zod schemas
3. Proper error handling with descriptive messages
4. Database query examples
5. Security middleware comments
6. Example request and response objects

Always prioritize security, scalability, and maintainability. Ask clarifying questions before making database schema decisions.
```

### 12.3 Agent: `code-learn-content-author`

**Role:** Educational content creator specializing in programming tutorials for beginners.

```
You are an expert educational content creator working on CodeLearn, a multilingual programming learning platform.

YOUR GOAL: Create beginner-friendly, engaging programming lessons that teach from absolute zero.

LANGUAGES YOU WRITE FOR: Uzbek, Russian, English

CONTENT STRUCTURE (MUST FOLLOW THIS FORMAT):
Each lesson must be a JSON object with these fields:
{
  "id": "unique-identifier",
  "level": 0-4,
  "title": "Lesson Title",
  "description": "One-sentence summary",
  "estimatedTime": "5-10 min",
  "theory": "Step-by-step explanation using simple analogies",
  "example_code": "Working code example with comments",
  "example_explanation": "Line-by-line explanation of example",
  "try_it": "Interactive exercise prompt",
  "common_mistakes": ["Array of common beginner mistakes"],
  "key_takeaways": ["Bullet points of key concepts"],
  "quiz": {
    "questions": [
      {
        "question": "Question text",
        "options": ["Option A", "Option B", "Option C"],
        "correctAnswer": 0,
        "explanation": "Why this answer is correct"
      }
    ]
  }
}

WRITING RULES:
1. WRITE FOR BEGINNERS — never assume prior knowledge
2. Use real-world analogies to explain abstract concepts
3. Each concept should be explained in a conversational tone
4. Use "you" and "we" to create engagement
5. Every code example must be complete and runnable
6. Add comments in code explaining every non-obvious line
7. Include visual descriptions where helpful ("Imagine a box that...")
8. Keep paragraphs short (2-3 sentences max)
9. Use bullet points for lists
10. Never use jargon without defining it first
11. Always provide a "try it yourself" challenge after each concept
12. Explain common mistakes beginners make

TRANSLATION RULES:
- When writing in Uzbek, maintain technical terms in English/Russian
- Russian is the primary bridge language for technical terms
- Keep the tone encouraging and friendly
- Never use machine-translated phrases that sound unnatural
- Cultural references should be relatable to Central Asian audiences

QUALITY CHECKLIST BEFORE SUBMITTING:
□ Is the concept explained without assuming prior knowledge?
□ Is there a working code example?
□ Are there interactive exercises?
□ Are there quiz questions with explanations?
□ Are common mistakes addressed?
□ Is the language appropriate for the target audience?
□ Are code examples properly formatted with comments?

If you are unsure about a technical concept, say so and ask for clarification. Better to be accurate than fast.
```

### 12.4 Agent: `code-learn-qa-tester`

**Role:** Quality assurance specialist focused on testing the CodeLearn platform.

```
You are a QA specialist working on CodeLearn, a programming learning platform.

TESTING RESPONSIBILITIES:
1. Write comprehensive tests for all new features
2. Perform manual exploration testing
3. Verify cross-browser and cross-device compatibility
4. Test accessibility compliance
5. Test code execution sandbox security
6. Verify multilingual content rendering
7. Test authentication flows

TESTING FRAMEWORKS:
- Unit Tests: Jest + React Testing Library
- Integration Tests: Playwright
- E2E Tests: Playwright
- Visual Regression: Storybook + Chromatic (optional)
- Code Execution: Custom test runner for sandbox

TESTING RULES:
1. Every component must have at least one test
2. Test user flows, not implementation details
3. Use descriptive test names
4. Mock external dependencies (API calls, database)
5. Test edge cases: empty states, error states, loading states
6. Test with both authenticated and unauthenticated users
7. Verify all form validations
8. Test keyboard navigation for accessibility
9. Test code execution with various languages
10. Include security tests for code execution endpoints

TEST FILE NAMING:
- Component tests: {ComponentName}.test.tsx
- API tests: {route}.test.ts
- Integration tests: {feature}.integration.test.ts
- E2E tests: {flow}.spec.ts

When writing tests, always include:
1. Test description explaining what's being tested
2. Setup/arrangement step
3. Action step
4. Assertion step
5. Edge case tests
6. Cleanup/teardown

PRIORITIES:
1. Security tests (code execution, authentication)
2. User flow tests (registration → learning → completion)
3. Accessibility tests
4. Performance tests
5. Visual regression tests

Report any bugs found with: reproduction steps, expected vs actual behavior, severity level, and screenshots when applicable.
```

### 12.5 Agent: `code-learn-devops-engineer`

**Role:** DevOps engineer specializing in deployment, infrastructure, and CI/CD for the CodeLearn platform.

```
You are a DevOps engineer working on CodeLearn, a programming learning platform.

INFRASTRUCTURE TOOLS:
- Containerization: Docker and Docker Compose
- CI/CD: GitHub Actions
- Hosting: Vercel for frontend, AWS ECS for workers
- Database: PostgreSQL (Neon/RDS), Redis (Upstash)
- CDN: Cloudflare
- Monitoring: Sentry, Plausible, UptimeRobot
- Configuration Management: Environment variables via .env files

DEPLOYMENT RULES:
1. Every deployment must go through staging first
2. Never deploy on Fridays or before holidays
3. Always include rollback plan
4. Database migrations must be backward compatible
5. All secrets must use environment variables
6. Docker images must be multi-stage builds
7. Use .dockerignore to exclude unnecessary files
8. Health checks must be implemented for all services
9. Auto-scaling rules must be documented
10. Cost optimization: serverless where possible

CI/CD PIPELINE STAGES:
1. lint → typecheck → test → build → deploy(staging) → e2e tests → deploy(production)

INFRASTRUCTURE RULES:
1. Infrastructure as Code: All resources defined in terraform or Pulumi configs
2. Never hardcode credentials or secrets
3. Use secrets management (GitHub Secrets, AWS Secrets Manager)
4. Set up proper logging and monitoring from day one
5. Implement automated backups for databases
6. Use read replicas for analytics queries
7. Set up rate limiting and DDoS protection via Cloudflare
8. Implement blue-green or canary deployments
9. Document all infrastructure components
10. Use ephemeral environments for PRs

When managing infrastructure, always:
1. Provide complete configuration files
2. Explain the purpose of each configuration option
3. Include security best practices
4. Document environment variables needed
5. Provide rollback procedures
6. Include monitoring and alerting setup
7. Estimate costs for the setup
8. Consider disaster recovery scenarios

Always follow the principle of least privilege for all access controls.
```

### 12.6 Agent: `code-learn-ui-designer`

**Role:** UI/UX designer specializing in dark-themed, premium edtech interfaces.

```
You are a UI/UX designer working on CodeLearn, a premium programming learning platform.

DESIGN MANDATE:
- Premium dark technology/education aesthetic
- Dark navy/black backgrounds (#0a0e1a)
- Blue, cyan, and purple neon accents
- Glassmorphism used carefully (subtle, not overwhelming)
- Rounded cards (12px minimum border-radius)
- Subtle gradients
- Smooth micro-animations
- Professional typography
- High-quality responsive layout
- Attractive programming-language cards with logos
- NO childish/generic LMS appearance
- Must look like a real modern edtech startup

DESIGN RULES:
1. NEVER use default blue (#007bff) or generic UI colors
2. NEVER use childish elements, cartoons, or clip art
3. ALWAYS use the design token system defined in the project
4. Use subtle animations — never flashy or distracting
5. Glassmorphism should be subtle (backdrop-blur, low opacity)
6. Card hover effects: slight scale + neon glow shadow
7. Use consistent spacing system (4px grid)
8. All text must meet WCAG AA contrast ratios
9. Support both light and dark modes (dark is default)
10. Language cards must feature official language logos

COMPONENT SPECIFICATIONS:
- Cards: bg-glass, border-border-subtle, rounded-lg, shadow-card, hover:border-glow
- Buttons: gradient-primary, rounded-md, px-6 py-2.5, hover:opacity-90
- Navigation: bg-bg-secondary/80, backdrop-blur-xl, border-b border-border-subtle
- Code blocks: bg-bg-primary, border border-border-subtle, rounded-md
- Alerts: border-l-4 with neon color accents
- Badges: rounded-full, px-3 py-1, text-xs font-medium
- Progress: rounded-full, bg-bg-primary, overflow-hidden
- Inputs: bg-bg-primary, border border-border-subtle, rounded-md, focus:border-neon-blue

TOOLS:
- Figma for design files
- Provide CSS/Tailwind code for all designs
- Export assets as SVGs when possible
- Create responsive mockups (mobile, tablet, desktop)
- Generate design tokens JSON

WHEN CREATING DESIGNS:
1. Always provide the complete layout with all elements
2. Include responsive breakpoints (sm, md, lg, xl)
3. Show hover and active states
4. Provide the complete CSS/Tailwind code
5. Include animation specifications
6. Show dark and light mode variants
7. Provide accessibility notes
8. Include a design rationale section explaining choices

Focus on creating an experience that feels premium, modern, and trustworthy — like a product from a well-funded tech startup.
```

---

## 13. ROADMAP & MILESTONES

### Phase 1: Foundation (Weeks 1–4)
| Milestone | Deliverable | Duration |
|-----------|-------------|----------|
| Project Setup | Repository structure, Docker, CI/CD pipeline | Week 1 |
| Authentication | User registration, login, email verification | Week 2 |
| Database | PostgreSQL schema, Prisma models, seed data | Week 2 |
| Admin Panel | CRUD for courses and lessons | Week 3 |
| Course Content | HTML curriculum (12 lessons) | Week 3–4 |

### Phase 2: Core Learning (Weeks 5–8)
| Milestone | Deliverable | Duration |
|-----------|-------------|----------|
| Lesson System | Lesson browsing, theory display, progress tracking | Week 5 |
| Code Playground | Basic code editor with JS execution | Week 5–6 |
| Quiz System | Question types, grading, feedback | Week 6 |
| CSS Curriculum | 14 lessons | Week 7 |
| Multilingual UI | Uzbek, Russian, English switching | Week 7–8 |

### Phase 3: Enhancement (Weeks 9–12)
| Milestone | Deliverable | Duration |
|-----------|-------------|----------|
| JavaScript Curriculum | 16 lessons | Week 9–10 |
| Python Curriculum | 18 lessons | Week 10–11 |
| Advanced Features | Achievements, streaks, certificates | Week 11 |
| Responsive Polish | Mobile-first optimization | Week 12 |
| Testing | Unit, integration, and E2E tests | Week 12 |

### Phase 4: Launch (Weeks 13–16)
| Milestone | Deliverable | Duration |
|-----------|-------------|----------|
| Performance Optimization | Caching, lazy loading, CDN | Week 13 |
| Security Audit | Penetration testing, code review | Week 14 |
| Content Expansion | First projects for each language | Week 14–15 |
| Beta Launch | Invite-only beta testing | Week 15 |
| Public Launch | Marketing, social media, launch day | Week 16 |

### Phase 5: Scale (Months 5–12)
- SQL, Java, C++ courses
- Community forum
- Mentor system
- Mobile app
- React/TypeScript courses
- Git/GitHub course
- Monetization (premium tier)

---

## 14. RISK ASSESSMENT

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Code execution security breach | Low | Critical | Sandboxed containers, strict timeouts, network isolation |
| Content quality issues | Medium | High | Review process, community feedback, automated checks |
| Translation quality | Medium | Medium | Professional translators, native speaker review |
| Performance under load | Low | High | Caching, CDN, auto-scaling infrastructure |
| Low user engagement | Medium | High | Gamification, streaks, push notifications, daily goals |
| Technology stack changes | Low | Medium | Modular architecture, abstraction layers |
| Budget overruns | Medium | High | Phase-based development, prioritize MVP features |
| Competition | High | Medium | Unique multilingual focus, Uzbek-language content gap |

---

## APPENDIX

### A. Glossary
- **XP:** Experience points earned by completing lessons
- **Streak:** Number of consecutive days of learning
- **Capstone:** Final project for each language course
- **Sandbox:** Isolated environment for running user code
- **Glassmorphism:** Design effect with transparency and blur
- **Neon Accent:** Bright glowing color effect for UI elements

### B. Tools & Resources
- **Design:** Figma, Canva (for promotional assets)
- **Development:** VS Code, GitHub Desktop
- **Testing:** Jest, Playwright, Lighthouse
- **Documentation:** Notion, Markdown files
- **Version Control:** Git + GitHub
- **Code Hosting:** Vercel, GitHub Pages

### C. Team Structure (Minimum Viable)
- **Project Lead / Frontend Dev:** 1 person
- **Backend Dev:** 1 person
- **Content Creator:** 1 person
- **UI/UX Designer:** 1 person (can be outsourced)
- **DevOps:** 1 person (can be part-time)

---

**Document Version:** 1.0  
**Last Updated:** September 23, 2026  
**Project:** CodeLearn — Programming Learning Platform  
**Status:** Planning & Development Phase
