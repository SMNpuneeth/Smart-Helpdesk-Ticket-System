# 🎫 Smart Helpdesk Ticket System

A full-stack support ticket management platform with role-based access control, JWT authentication, ticket ratings, and a modern admin dashboard — **fully Dockerized** so you can go from clone to running app in a single command.

Built with **FastAPI** on the backend and **Next.js 16** on the frontend, simulating how enterprise helpdesk platforms operate in production.

![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?logo=python&logoColor=white)
![Node](https://img.shields.io/badge/Node-20%2B-339933?logo=node.js&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14%2B-336791?logo=postgresql&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwind-css&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white)
![Compose](https://img.shields.io/badge/Docker_Compose-v2-1488C6?logo=docker&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📑 Table of Contents

- [🖼️ What's Inside](#-whats-inside)
- [🎯 Why This Project Was Built](#-why-this-project-was-built)
- [🧠 Core Features](#-core-features)
- [🛠 Tech Stack](#-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🔁 System Workflow](#-system-workflow)
- [🐳 Quick Start with Docker (Recommended)](#-quick-start-with-docker-recommended)
- [▶️ Run Locally (without Docker)](#️-run-locally-without-docker)
- [🔑 Environment Variables](#-environment-variables)
- [🌐 API Endpoints](#-api-endpoints)
- [✅ Best Practices](#-best-practices)
- [📌 Future Enhancements](#-future-enhancements)
- [👨‍💻 Author](#-author)

---

## 🖼️ What's Inside

A complete ticket lifecycle system with three distinct user experiences:

- **Employees** raise tickets, track status, comment on their own cases, and rate the resolution once a ticket is closed.
- **Agents** receive assigned tickets, update progress, resolve issues, and respond to comments.
- **Admins** manage every user, assign work to agents, oversee the full queue, and review satisfaction ratings.

Includes a responsive Next.js admin dashboard, secure REST API, database migrations, an opinionated frontend architecture (services, hooks, schemas, role-based routing), a rating/reopen cycle for closed tickets, and a one-command **Docker Compose** setup that spins up Postgres + backend + frontend together.

---

## 🎯 Why This Project Was Built

- Practice professional backend architecture (layered, testable, secure)
- Implement real authentication and role-based authorization
- Handle production-style database workflows with Alembic migrations
- Build a modern, type-safe frontend with Next.js App Router
- Learn containerization with Docker and multi-service orchestration via Docker Compose
- Ship a real product surface, not just CRUD endpoints

---

## 🧠 Core Features

### 👤 User & Role System
- Self-service registration and login
- Three roles: `admin`, `agent`, `employee`
- Encrypted passwords (bcrypt)
- Admin can create users, change roles, reset passwords, and delete accounts

### 🎫 Ticket Handling
- Create, view, edit, assign, progress, close, **reopen**, and **rate** tickets
- Ticket statuses: `open`, `assigned`, `in_progress`, `resolved`, `closed`
- Admins assign tickets to agents
- Agents update status; both agents and admins can close
- **Reopen** a closed ticket (returns to `in_progress`) when the issue comes back
- **Star ratings** (1–5) with optional comments once a ticket is closed
- Per-resolution rating cycle (each close → rate → close cycle is tracked separately)
- Comment thread on every ticket

### 📊 Admin Dashboard
- Live stats: total, open, in-progress, closed, and average rating
- Recent activity feed (5 most recent tickets)
- Quick action panel (create ticket, browse all, manage users)
- Role-aware views (employees see their own; agents see assigned; admins see everything)

### 👥 User Management (Admin)
- Searchable user directory
- Inline role switching
- One-click password reset
- Account deletion with confirmation

### 🔐 Security
- JWT token authentication (HS256, 120-minute expiry)
- Protected API routes via dependency injection
- CORS configured for the frontend
- Environment-based secrets (never committed)
- Bcrypt directly (no passlib — see `core/security.py`)

### 🗄 Database
- PostgreSQL with SQLAlchemy ORM
- Alembic migrations for schema version control
- Models: `User`, `Ticket`, `TicketComment`, `TicketRating`, plus role/status/priority enums

### 🐳 Containerization
- Multi-stage Dockerfiles for backend (Python 3.12-slim) and frontend (Node 20-alpine)
- One-command stack startup with `docker compose up --build`
- Healthchecks on all three services so startup ordering is correct
- Migrations run automatically on backend container start
- Non-root users in both app containers
- `output: 'standalone'` keeps the frontend runtime image small
- `.dockerignore` files keep build contexts minimal

---

## 🛠 Tech Stack

### Backend
| Layer | Tool |
|---|---|
| Framework | FastAPI |
| ORM | SQLAlchemy 2.x |
| Database | PostgreSQL |
| Migrations | Alembic |
| Auth | JWT (python-jose) |
| Hashing | bcrypt (direct, no passlib) |
| Validation | Pydantic v2 |
| Config | pydantic-settings + python-dotenv |
| Runtime | Python 3.12 (slim Docker base) |
| ASGI | uvicorn |

### Frontend
| Layer | Tool |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + Tailwind CSS 4 |
| Components | shadcn-style (Radix-based) |
| Data fetching | TanStack Query (React Query) |
| Forms | react-hook-form + Zod |
| HTTP | Axios |
| Animations | framer-motion |
| Icons | lucide-react |
| Toasts | sonner |
| Runtime | Node 20 (alpine Docker base, standalone output) |

### DevOps / Docker
| Layer | Tool |
|---|---|
| Containerization | Docker (multi-stage builds) |
| Orchestration | Docker Compose v2 |
| Database image | `postgres:16-alpine` |
| Backend image | `python:3.12-slim` |
| Frontend image | `node:20-alpine` |
| Healthchecks | `curl`, `wget`, `pg_isready` |
| Build optimization | `output: 'standalone'`, `.dockerignore` |

---

## 📁 Project Structure

```
Smart-Helpdesk-Ticket-System/
├── api/                     # FastAPI route handlers
│   ├── auth.py              #   login, register, /me
│   ├── tickets.py           #   ticket CRUD + assign + status + close + reopen
│   ├── users.py             #   admin user management
│   ├── comments.py          #   comment thread
│   ├── ratings.py           #   star ratings + reopen flow
│   ├── deps.py              #   role-based dependencies
│   └── router.py            #   API aggregator
│
├── core/                    # Cross-cutting concerns
│   ├── config.py            #   settings (env-driven)
│   └── security.py          #   JWT + password hashing
│
├── db/db.py                 # SQLAlchemy session factory
│
├── models/                  # SQLAlchemy ORM models
│   ├── user.py
│   ├── ticket.py
│   ├── comment.py
│   ├── rating.py
│   └── enums.py             #   role + status + priority enums
│
├── schemas/                 # Pydantic request/response models
│   ├── user.py
│   ├── ticket.py
│   ├── comment.py
│   └── rating.py
│
├── services/                # Business logic layer
│   ├── auth_service.py
│   ├── ticket_service.py
│   ├── user_service.py
│   ├── comment_service.py
│   └── rating_service.py
│
├── alembic/                 # Database migrations (6 versions)
│   └── versions/
├── alembic.ini
├── main.py                  # FastAPI app entrypoint
├── requirements.txt
│
├── Dockerfile               # Backend multi-stage image (Python 3.12-slim)
├── docker-compose.yml       # Postgres + backend + frontend orchestration
├── entrypoint.sh            # Wait-for-DB → migrate → start uvicorn
├── .dockerignore            # Lean backend build context
│
├── frontend/                # Next.js 16 app
│   ├── app/
│   │   ├── (auth)/          #   login + register
│   │   └── (app)/           #   protected routes
│   │       ├── dashboard/   #   stats + recent activity
│   │       ├── tickets/     #   list, detail, new, edit
│   │       ├── users/       #   admin user management
│   │       └── layout.tsx   #   sidebar + topbar shell
│   ├── components/
│   │   ├── auth/            #   route guard, permission gate
│   │   ├── comments/        #   comment thread, composer
│   │   ├── layout/          #   sidebar, topbar, page header
│   │   ├── tickets/         #   ticket card, filters, actions,
│   │   │                    #   close-ticket-dialog, reopen-dialog,
│   │   │                    #   rating-card, star-picker, badges
│   │   ├── users/           #   role-badge
│   │   └── ui/              #   button, card, dialog, table…
│   ├── lib/
│   │   ├── api/             #   axios client + endpoint defs
│   │   ├── auth/            #   token + session + guards
│   │   ├── hooks/           #   use-auth, use-tickets, use-users,
│   │   │                    #   use-comments, use-ratings
│   │   ├── services/        #   auth/ticket/user/comment/rating layer
│   │   ├── schemas/         #   Zod validation schemas
│   │   ├── constants/       #   roles, statuses, priorities
│   │   ├── types/           #   shared TS types
│   │   └── utils/           #   format helpers
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.ts       #   BACKEND_URL-aware rewrite + standalone output
│   ├── Dockerfile           #   Frontend multi-stage image (Node 20-alpine)
│   └── .dockerignore
│
├── .env.example             # safe template (copy → .env)
├── .gitignore
└── README.md
```

---

## 🔁 System Workflow

### Authentication Flow
1. User registers or logs in → backend returns JWT access token
2. Frontend stores token → attaches it to every request via Axios interceptor
3. `RouteGuard` redirects unauthenticated users to `/login`
4. `PermissionGate` hides UI for users without the right role

### Ticket Lifecycle
1. **Employee** creates a ticket (status: `open`)
2. **Admin** assigns it to an **agent** (status: `assigned`)
3. **Agent** progresses it: `in_progress` → `resolved`
4. **Agent** or **admin** closes the ticket (status: `closed`)
5. **Owner** submits a 1–5 star rating with optional comment
6. If the issue returns, the owner **reopens** it (back to `in_progress`); the next close starts a new rating cycle

### Role Matrix

| Action | Employee | Agent | Admin |
|---|:---:|:---:|:---:|
| Create ticket | ✅ | ✅ | ✅ |
| View own tickets | ✅ | ✅ | ✅ |
| View assigned tickets | ❌ | ✅ | ❌ |
| View all tickets | ❌ | ❌ | ✅ |
| Assign ticket to agent | ❌ | ❌ | ✅ |
| Update ticket status | ❌ | ✅ | ✅ |
| Close ticket | ❌ | ✅ | ✅ |
| Reopen closed ticket | own | assigned | any |
| Rate closed ticket | own | assigned | any |
| Comment on ticket | own | assigned | any |
| Manage users | ❌ | ❌ | ✅ |
| Access dashboard | ✅ | ✅ | ✅ |

---

## 🐳 Quick Start with Docker (Recommended)

The fastest way to get the whole stack — **PostgreSQL, FastAPI backend, and Next.js frontend** — running on your machine is `docker compose`.

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (or Docker Engine + Compose v2 on Linux)
- ~4 GB of free RAM for the three containers

### 1. Clone and configure
```bash
git clone https://github.com/SMNpuneeth/Smart-Helpdesk-Ticket-System
cd Smart-Helpdesk-Ticket-System

# Copy the env template and edit it. At minimum, change SECRET_KEY.
cp .env.example .env
# Generate a strong key:  openssl rand -hex 32
```

### 2. Build and start
```bash
docker compose up --build
```

First build takes a few minutes (downloading base images, installing deps). Subsequent builds are incremental.

### 3. Open the app
| Service  | URL                          | Notes                          |
|----------|------------------------------|--------------------------------|
| Frontend | http://localhost:3000        | Main UI                        |
| Backend  | http://localhost:8000        | REST API                       |
| API docs | http://localhost:8000/docs   | Swagger UI                     |
| Postgres | `localhost:5432`             | User/pw/db from `.env`         |

### 4. Promote yourself to admin
After registering your first user through the UI:
```bash
docker compose exec db psql -U postgres -d helpdesk \
  -c "UPDATE users SET role='admin' WHERE email='you@example.com';"
```

### Useful Docker commands
```bash
# Run in the background
docker compose up -d --build

# Tail logs for a single service
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f db

# Stop everything (keeps the database volume)
docker compose down

# Stop AND delete the database volume (wipe all data)
docker compose down -v

# Open a shell inside the backend container
docker compose exec backend bash

# Re-run migrations manually
docker compose exec backend alembic upgrade head

# Check service health
docker compose ps
```

### How the Docker setup works

- **`docker-compose.yml`** orchestrates three services on a private network (`db`, `backend`, `frontend`).
- **`db`** is `postgres:16-alpine` with a named volume `helpdesk_postgres_data` so data survives container restarts. Has a `pg_isready` healthcheck.
- **`backend`** uses a multi-stage `Dockerfile` (Python 3.12-slim), runs as a non-root `appuser`, and **`entrypoint.sh`** waits for Postgres to be reachable before running `alembic upgrade head`, then launches uvicorn.
- **`frontend`** uses a multi-stage `Dockerfile` (Node 20-alpine) with Next.js `output: 'standalone'` for a small runtime image. Inside the Docker network, `BACKEND_URL=http://backend:8000` rewrites `/api/*` calls to the backend container — never your host machine.
- **`.dockerignore`** files in both the repo root and `frontend/` keep the build context lean (no `node_modules`, no `.git`, no `.env`).
- Healthchecks on all three services so `depends_on` waits for **actual readiness**, not just startup.

---

## ▶️ Run Locally (without Docker)

If you prefer running each service directly on your machine:

### Prerequisites
- **Python** 3.10+
- **Node.js** 20+
- **PostgreSQL** 14+

### 1. Clone the repository
```bash
git clone https://github.com/SMNpuneeth/Smart-Helpdesk-Ticket-System
cd Smart-Helpdesk-Ticket-System
```

### 2. Backend setup
```bash
# Create virtual environment
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create your .env file (use the template)
cp .env.example .env
# Edit .env with your DATABASE_URL and a long random SECRET_KEY

# Apply database migrations
alembic upgrade head

# Start the API server
uvicorn main:app --reload
```

The API will be available at **http://127.0.0.1:8000**
Interactive docs: **http://127.0.0.1:8000/docs**

### 3. Frontend setup
```bash
cd frontend

# Install dependencies
npm install

# Start the dev server (no env file required by default)
npm run dev
```

The frontend will be available at **http://localhost:3000**

> **Note:** `next.config.ts` ships with dev rewrites that proxy `/api/*` → `${BACKEND_URL}/api/*` (defaults to `http://127.0.0.1:8000`), so the frontend talks to your local backend automatically.
> If your backend runs elsewhere, set `BACKEND_URL=http://your-backend:port` in `frontend/.env.local`.

### 4. First user
Register through the UI (becomes `employee` by default), then promote yourself to `admin` directly in the database:
```sql
UPDATE users SET role = 'admin' WHERE email = 'you@example.com';
```

---

## 🔑 Environment Variables

### Backend (`.env` in repo root)
Used by both local Python and `docker compose` (via `${VAR}` substitution).
```bash
# PostgreSQL connection string
# Local:  postgresql+psycopg2://user:password@localhost:5432/your_db
# Docker: postgresql+psycopg2://postgres:postgres@db:5432/helpdesk
DATABASE_URL=postgresql+psycopg2://user:password@localhost:5432/your_db

# JWT signing secret — generate with: openssl rand -hex 32
SECRET_KEY=replace-with-a-long-random-string

# JWT algorithm
ALGORITHM=HS256

# Token expiry in minutes
ACCESS_TOKEN_EXPIRE_MINUTES=120
```

### Docker-only variables (`.env` in repo root)
Read by `docker-compose.yml` when starting the `db` service.
```bash
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=helpdesk
```

### Frontend (optional — `frontend/.env.local`)
Only needed if your backend is **not** running on `http://127.0.0.1:8000`:
```bash
# Default: http://127.0.0.1:8000
BACKEND_URL=http://your-backend:port
```

---

## 🌐 API Endpoints (Summary)

Base URL: `http://localhost:8000` (via Docker) or `http://127.0.0.1:8000` (local). Interactive Swagger docs at `/docs`.

### Auth (`/auth`)
- `POST /auth/register` — create new user (employee)
- `POST /auth/login` — get JWT token
- `GET /auth/me` — get current user

### Tickets (`/tickets`)
- `POST /tickets/` — create ticket
- `GET /tickets/me` — list my tickets
- `GET /tickets/assigned` — list assigned tickets *(agent)*
- `GET /tickets/` — list all tickets *(admin)*
- `GET /tickets/{id}` — view ticket
- `PATCH /tickets/{id}` — edit ticket
- `PATCH /tickets/{id}/assign` — assign to agent *(admin)*
- `PATCH /tickets/{id}/status` — change status *(agent)*
- `PATCH /tickets/{id}/close` — close ticket *(agent/admin)*
- `PATCH /tickets/{id}/reopen` — reopen closed ticket

### Ratings (`/ratings`)
- `POST /ratings/ticket/{ticket_id}` — submit a 1–5 star rating
- `GET /ratings/ticket/{ticket_id}` — list ratings for a ticket
- `GET /ratings/ticket/{ticket_id}/current` — current cycle rating

### Users (`/users`)
- `GET /users/` — list all users *(admin)*
- `GET /users/{id}` — get user *(admin)*
- `POST /users/create-user` — create user *(admin)*
- `PATCH /users/{id}/role` — change role *(admin)*
- `PATCH /users/{id}/reset-password` — reset password *(admin)* (response: `{ message, data }`)
- `DELETE /users/` — delete user *(admin)* (admins cannot be deleted)

### Comments (`/comments`)
- `POST /comments/` — add comment
- `GET /comments/ticket/{ticket_id}` — list comments for a ticket

---

## ✅ Best Practices Used

- **Layered backend architecture** — `api → services → models`, no business logic in route handlers
- **Dependency injection** for auth and DB sessions
- **Role-based authorization** via reusable FastAPI dependencies
- **Type-safe frontend** — TypeScript everywhere, Zod validation on form boundaries
- **Service layer on the frontend** — `services/` wraps API calls, `hooks/` wraps them in React Query
- **Centralized config** — pydantic-settings for backend, env-driven `BACKEND_URL` for frontend
- **Database migrations** — never mutate schema outside Alembic
- **Secure secrets** — `.env` ignored, `.env.example` provided as template
- **Container hygiene** — non-root users in both app containers, multi-stage builds for small images, `.dockerignore` to keep build context minimal
- **Proper dependency ordering** — healthchecks + `depends_on: { condition: service_healthy }` so the backend doesn't start until Postgres is actually ready

---

## 📌 Future Enhancements

- Email notifications on assignment, status change, and rating prompt
- File attachments on tickets
- Ticket priority and category tags
- SLA tracking and breach alerts
- Reports & analytics (resolution time, agent workload, rating trends)
- Audit log for admin actions
- WebSocket-based real-time updates
- Export tickets to CSV/PDF
- Production deployment templates (Render, Fly.io, Railway, AWS)

---

## 👨‍💻 Author

**Puneeth Sai**
Backend Developer — FastAPI, PostgreSQL, Next.js
GitHub: [@SMNpuneeth](https://github.com/SMNpuneeth)
