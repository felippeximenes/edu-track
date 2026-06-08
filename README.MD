# EduTrack

A learning management system (LMS) built with Node.js, Express, React, and MySQL. Students can enroll in courses, watch video lessons, track progress, and earn certificates. Instructors manage courses, modules, and lessons through a dedicated panel. Admins have full user management and platform statistics.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Features](#features)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Roles and Permissions](#roles-and-permissions)
- [Seed Data](#seed-data)
- [Certificate Generation](#certificate-generation)

---

## Tech Stack

**Backend**
- Node.js + Express + TypeScript
- Prisma ORM with MySQL
- JWT authentication (jsonwebtoken)
- Password hashing (bcryptjs)
- PDF generation via Playwright (headless Chromium) + QR codes (qrcode)
- Schema validation (Zod)

**Frontend**
- React 19 + TypeScript
- React Router DOM v7
- Axios for HTTP
- CSS Modules — one `.module.css` per component
- Custom dark glassmorphism design system

---

## Architecture Overview

```
edu-track-1/
├── backend/          Express API on port 3001
└── frontend/         React app on port 3000
```

The frontend communicates with the backend over HTTP. Authentication uses JWT tokens stored in `localStorage`. The token is attached automatically to every request via an Axios interceptor.

---

## Features

### Student
- Browse and search the course catalog
- Enroll in courses
- Watch video lessons (YouTube and Vimeo embeds)
- Mark lessons as completed
- View per-course progress with animated progress bars
- Download PDF certificates upon course completion
- Share public certificate verification links

### Instructor
- Create, view, and delete courses
- Add modules to courses
- Add video lessons to modules or directly to courses
- View only courses they own

### Admin
- All student and instructor capabilities
- List all platform users
- Change user roles
- Delete user accounts
- View platform statistics (total users, courses, enrollments, lessons completed)

---

## Database Schema

```
User
  id, name, email, password, role (STUDENT | INSTRUCTOR | ADMIN)

Course
  id, title, description, instructorId → User

Module
  id, title, courseId → Course

Lesson
  id, title, content, videoUrl, courseId → Course, moduleId → Module (optional)

Enrollment
  id, userId → User, courseId → Course

LessonProgress
  id, userId → User, lessonId → Lesson, completedAt

Certificate
  id, userId → User, courseId → Course, issuedAt, code (unique)
```

Lessons can belong to a module or sit directly on a course (loose lessons). Certificates carry a unique verification code used in public URLs.

---

## API Reference

All protected routes require the header:
```
Authorization: Bearer <token>
```

### Auth

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/auth/register` | — | Register new user |
| POST | `/auth/login` | — | Login, returns JWT + user |

### Courses

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/courses` | Required | List all courses |
| GET | `/courses/:id` | Required | Course detail with modules and lessons |
| POST | `/courses` | INSTRUCTOR / ADMIN | Create course |
| PUT | `/courses/:id` | INSTRUCTOR / ADMIN | Update course |
| DELETE | `/courses/:id` | INSTRUCTOR / ADMIN | Delete course |

### Modules

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/modules/course/:courseId` | Required | List modules for a course |
| POST | `/modules` | INSTRUCTOR / ADMIN | Create module |
| PUT | `/modules/:id` | INSTRUCTOR / ADMIN | Update module |
| DELETE | `/modules/:id` | INSTRUCTOR / ADMIN | Delete module |

### Lessons

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/lessons/module/:moduleId` | Required | Lessons in a module |
| GET | `/lessons/:id` | Required | Single lesson |
| POST | `/lessons` | INSTRUCTOR / ADMIN | Create lesson |
| PUT | `/lessons/:id` | INSTRUCTOR / ADMIN | Update lesson |
| DELETE | `/lessons/:id` | INSTRUCTOR / ADMIN | Delete lesson |

### Enrollments

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/enrollments` | STUDENT / ADMIN | Enroll in a course |
| GET | `/enrollments/user/:userId` | Required | User's enrollments |
| GET | `/enrollments/course/:courseId` | Required | Course enrollments |

### Progress

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/progress/complete` | STUDENT / ADMIN | Mark lesson as complete |
| GET | `/progress/course/:courseId` | STUDENT / ADMIN | Course progress for current user |

### Certificates

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/certificates` | Required | List user's certificates |
| GET | `/certificates/pdf/:id` | Required | Download certificate as PDF |
| GET | `/certificates/verify/:code` | — | Public certificate verification |

### Admin

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/admin/users` | ADMIN | List all users |
| PATCH | `/admin/users/:id/role` | ADMIN | Change user role |
| DELETE | `/admin/users/:id` | ADMIN | Delete user |
| GET | `/admin/stats` | ADMIN | Platform statistics |

---

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma          Database schema
│   └── migrations/            Migration history
├── src/
│   ├── server.ts              Express app entry, route registration
│   ├── lib/prisma.ts          Prisma client singleton
│   ├── auth/                  JWT auth, middleware, role guard
│   ├── courses/               Course CRUD
│   ├── modules/               Module CRUD
│   ├── lessons/               Lesson CRUD
│   ├── enrollment/            Enrollment logic
│   ├── progress/              Lesson progress tracking
│   ├── certificate/           Certificate generation (Playwright + QR)
│   ├── admin/                 Admin-only user management
│   └── prisma/seed.ts         Database seed script
└── .env                       Environment variables (not committed)

frontend/
├── public/
│   └── index.html
└── src/
    ├── index.tsx              CRA entry point
    ├── App.tsx                AuthProvider + AppRoutes
    ├── index.css              Global design system (CSS variables, utilities)
    ├── api/axios.ts           Axios instance with auth interceptor
    ├── contexts/
    │   └── AuthContext.tsx    Global auth state, localStorage persistence
    ├── components/
    │   ├── Navbar.tsx         Role-aware top navigation
    │   └── PrivateRoute.tsx   Route guard with role-based access
    ├── routes/
    │   └── AppRoutes.tsx      All routes with role restrictions
    └── pages/
        ├── Login.tsx          Login form
        ├── Courses.tsx        Course catalog with search
        ├── CourseDetail.tsx   Course page with module accordion and enrollment
        ├── LessonPlayer.tsx   Video embed + progress marking
        ├── Dashboard.tsx      Student progress overview
        ├── Certificates.tsx   Certificate list + PDF download
        └── InstructorPanel.tsx  Course/module/lesson management
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL 8+ running locally on port 3306
- A database named `edutrack` created in MySQL

```sql
CREATE DATABASE edutrack;
```

### 1. Clone the repository

```bash
git clone https://github.com/felippeximenes/edu-track.git
cd edu-track-1
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create the `.env` file (see [Environment Variables](#environment-variables)), then run:

```bash
npx prisma generate
npx prisma migrate deploy
npm run seed
npm run dev
```

The API will be available at `http://localhost:3001`.

### 3. Frontend setup

Open a second terminal:

```bash
cd frontend
npm install
npm start
```

The app will open at `http://localhost:3000`.

---

## Environment Variables

Create `backend/.env` with the following:

```env
DATABASE_URL="mysql://root:<password>@localhost:3306/edutrack"
JWT_SECRET="your-secret-key"
APP_URL="http://localhost:3001"
PORT=3001
```

A template is available at `backend/.env.example`.

---

## Roles and Permissions

| Feature | STUDENT | INSTRUCTOR | ADMIN |
|---------|---------|------------|-------|
| Browse courses | Yes | Yes | Yes |
| Enroll in courses | Yes | — | Yes |
| Watch lessons | Yes (enrolled) | Yes | Yes |
| Mark progress | Yes | — | Yes |
| Download certificates | Yes | — | Yes |
| Create/manage courses | — | Yes (own) | Yes |
| Create modules/lessons | — | Yes (own) | Yes |
| Manage all users | — | — | Yes |
| View platform stats | — | — | Yes |

Role-based access is enforced on both the API (Express middleware) and the frontend (protected routes with role checks).

---

## Seed Data

Running `npm run seed` from the `backend` directory creates:

| Role | Email | Password |
|------|-------|----------|
| INSTRUCTOR | prof@example.com | 123456 |
| STUDENT | felippe@example.com | 123456 |

It also creates one sample course with one module, three lessons, and full progress for the student, along with an enrollment.

---

## Certificate Generation

Certificates are generated as PDF files using Playwright (headless Chromium). Each certificate includes:

- Student name and course title
- Issue date
- A unique verification code
- A QR code linking to the public verification URL (`/certificates/verify/:code`)

Playwright's Chromium browser is installed separately from the Node.js packages. After `npm install`, run:

```bash
npx playwright install chromium
```

This is required for the certificate PDF endpoint to work.

---

## Git Branches

| Branch | Purpose |
|--------|---------|
| `feat/backend-setup` | Backend API, database schema, auth, business logic |
| `feat/frontend` | React frontend, design system, all UI pages |
