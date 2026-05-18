# TaskFlow - Task Management Application

A full-stack task management web app with role-based access control.

## Live Demo

[View App](YOUR_RAILWAY_URL_HERE)

## Features

- User registration and login with JWT authentication
- Role-based access control (Admin / User)
- Create, read, update, delete tasks
- Filter tasks by status and priority
- Admin dashboard with stats and user management
- PostgreSQL database with proper relationships

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Auth:** JWT + bcrypt
- **Frontend:** Vanilla HTML/CSS/JS
- **Deployment:** Railway

## API Endpoints

### Auth

| Method | Endpoint           | Access     |
| ------ | ------------------ | ---------- |
| POST   | /api/auth/register | Public     |
| POST   | /api/auth/login    | Public     |
| GET    | /api/auth/profile  | User/Admin |
| GET    | /api/auth/users    | Admin only |

### Tasks

| Method | Endpoint         | Access     |
| ------ | ---------------- | ---------- |
| POST   | /api/tasks       | User/Admin |
| GET    | /api/tasks       | User/Admin |
| GET    | /api/tasks/:id   | User/Admin |
| PUT    | /api/tasks/:id   | User/Admin |
| DELETE | /api/tasks/:id   | User/Admin |
| GET    | /api/tasks/stats | Admin only |

## Setup Locally

```bash
npm install
# Set DATABASE_URL in .env
npm run dev
```
