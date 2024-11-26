# Task Management API

A robust task management API built with Node.js, Express, and TypeScript.

## Features

- 🔐 Authentication & Authorization

  - JWT-based authentication
  - Role-based access control (Employee/Employer)
  - Secure password hashing

- 📋 Task Management

  - Create, assign, and update tasks
  - Track task status and priority
  - Due date management
  - Task assignment workflow

- 👥 User Management

  - User registration and login
  - Role-based permissions
  - Employee task summary

- 🏗 Architecture
  - Domain-Driven Design (DDD)
  - Dependency Injection
  - Repository Pattern
  - Clean Architecture
  - Type-safe validation

## Tech Stack

- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: Docker

## Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL
- Docker (optional)

### Installation

1. Install dependencies:

```bash
npm install
```

2. Set up the database:

```bash
npm run prisma:generate
npm run prisma:push
```

3. Start the development server:

```bash
npm run dev
```

### Docker Setup

1. Build and start containers:

```bash
npm run docker:build
npm run docker:up
```

2. Stop containers:

```bash
npm run docker:down
```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/signin` - User login

### Tasks (Employee)

- `GET /api/tasks/assigned` - Get assigned tasks
- `PATCH /api/tasks/:id/status` - Update task status

### Tasks (Employer)

- `POST /api/tasks` - Create a new task
- `GET /api/tasks` - Get all tasks
- `PATCH /api/tasks/:id` - Assign task
- `GET /api/tasks/employee-summary` - Get employee task summary

## Validation

The API uses Zod for request validation.
Example validation schema:

```typescript
const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(100),
    description: z.string().min(10).max(500),
    dueDate: z.string().datetime(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
    assigneeId: z.number().optional(),
  }),
});
```

## Error Handling

The API provides detailed error responses:

```json
{
  "status": "error",
  "message": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": [
    {
      "field": "title",
      "message": "Title must be at least 3 characters long"
    }
  ]
}
```
