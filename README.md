# Job Tracker

MERN-stack job application tracker. Kanban board (Applied, Interview, Offer, Rejected), drag-and-drop status changes, search, JWT auth.

## Setup

Requires Node 20+ and a MongoDB instance (local or Atlas).

```bash
cp server/.env.example server/.env   # set MONGO_URI and JWT_SECRET
npm run install:all
npm run dev
```

- Client: http://localhost:5173
- API: http://localhost:5000

## API

| Method | Route | Description |
|---|---|---|
| POST | /api/auth/register | Create account |
| POST | /api/auth/login | Log in |
| GET | /api/auth/me | Current user |
| GET | /api/jobs?status=&q= | List applications |
| POST | /api/jobs | Create application |
| PUT | /api/jobs/:id | Update application |
| DELETE | /api/jobs/:id | Delete application |

## Stack

MongoDB, Express 5, React 18 (Vite), Node.js, JWT, bcrypt.
