# 🎫 Smart Helpdesk Ticket System

A full-stack support ticket management platform with role-based access control, JWT authentication, and a modern admin dashboard.

Built with **FastAPI** on the backend and **Next.js 16** on the frontend, simulating how enterprise helpdesk platforms operate in production.

---

## 🖼️ What's Inside

A complete ticket lifecycle system with three distinct user experiences:

- **Employees** raise tickets, track status, and comment on their own cases.
- **Agents** receive assigned tickets, update progress, and resolve issues.
- **Admins** manage every user, assign work to agents, and oversee the full queue.

Includes a responsive Next.js admin dashboard, secure REST API, database migrations, and an opinionated frontend architecture (services, hooks, schemas, role-based routing).

---

## 🎯 Why This Project Was Built

- Practice professional backend architecture (layered, testable, secure)
- Implement real authentication and role-based authorization
- Handle production-style database workflows with Alembic migrations
- Build a modern, type-safe frontend with Next.js App Router
- Ship a real product surface, not just CRUD endpoints

---

## 🧠 Core Features

### 👤 User & Role System
- Self-service registration and login
- Three roles: `admin`, `agent`, `employee`
- Encrypted passwords (bcrypt)
- Admin can create users, change roles, reset passwords, and delete accounts

### 🎫 Ticket Handling
- Create, view, edit, and close tickets
- Ticket statuses: `open`, `assigned`, `in_progress`, `resolved`, `closed`
- Admins assign tickets to agents
- Agents update status; both agents and admins can close
- Comment thread on every ticket

### 📊 Admin Dashboard
- Live stats: total, open, in-progress, and closed counts
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

### 🗄 Database
- PostgreSQL with SQLAlchemy ORM
- Alembic migrations for schema version control
- Models: `User`, `Ticket`, `Comment`, plus role/status enums

---

## 🛠 Tech Stack

### Backend
| Layer | Tool |
|---|---|
| Framework | FastAPI |
| ORM | SQLAlchemy |
| Database | PostgreSQL |
| Migrations | Alembic |
| Auth | JWT (python-jose) |
| Hashing | bcrypt (passlib) |
| Validation | Pydantic v2 |
| Config | pydantic-settings + python-dotenv |

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

---

## 📁 Project Structure

```
Smart-Helpdesk-Ticket-System/
├── api/                     # FastAPI route handlers
│   ├── auth.py              #   login, register, refresh
│   ├── tickets.py           #   ticket CRUD + assign + close
│   ├── users.py             #   admin user management
│   ├── comments.py          #   comment thread
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
│   └── enums.py             #   role + status enums
│
├── schemas/                 # Pydantic request/response models
│
├── services/                # Business logic layer
│   ├── auth_service.py
│   ├── ticket_service.py
│   ├── user_service.py
│   └── comment_service.py
│
├── alembic/                 # Database migrations
├── alembic.ini
├── main.py                  # FastAPI app entrypoint
├── requirements.txt
│
├── frontend/                # Next.js 16 app
│   ├── app/
│   │   ├── (auth)/          #   login + register
│   │   └── (app)/           #   protected routes
│   │       ├── dashboard/   #   stats + recent activity
│   │       ├── tickets/     #   list, detail, new
│   │       ├── users/       #   admin user management
│   │       └── layout.tsx   #   sidebar + topbar shell
│   ├── components/
│   │   ├── auth/            #   route guard, permission gate
│   │   ├── layout/          #   sidebar, topbar, page header
│   │   ├── tickets/         #   ticket card, filters, actions
│   │   └── ui/              #   button, card, dialog, table…
│   ├── lib/
│   │   ├── api/             #   axios client + endpoint defs
│   │   ├── hooks/           #   use-auth, use-tickets, use-users
│   │   ├── services/        #   auth/ticket/user service layer
│   │   ├── schemas/         #   Zod validation schemas
│   │   ├── constants.ts     #   roles, statuses
│   │   ├── types/           #   shared TS types
│   │   └── utils.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── next.config.ts
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
5. Comments can be added at any step

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
| Comment on ticket | own | assigned | any |
| Manage users | ❌ | ❌ | ✅ |
| Access dashboard | ✅ | ✅ | ✅ |

---

## ▶️ How to Run the Project

### Prerequisites
- Python 3.10+
- Node.js 20+
- PostgreSQL 14+

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

> **Note:** `next.config.ts` ships with dev rewrites that proxy `/api/*` → `http://127.0.0.1:8000/api/*`, so the frontend talks to your local backend automatically.
> If your backend runs elsewhere, create `frontend/.env.local` with `NEXT_PUBLIC_API_BASE_URL=http://your-backend:port`.

---

## 🔑 Environment Variables

### Backend (`.env`)
```bash
DATABASE_URL=postgresql+psycopg2://user:password@localhost:5432/your_db
SECRET_KEY=replace-with-a-long-random-string
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=120
```

### Frontend (optional — `frontend/.env.local`)
Only needed if your backend is **not** running on `http://127.0.0.1:8000`:
```bash
NEXT_PUBLIC_API_BASE_URL=http://your-backend:port
```

---

## 🌐 API Endpoints (Summary)

### Auth (`/auth`)
- `POST /auth/register` — create new user (employee)
- `POST /auth/login` — get JWT token

### Tickets (`/tickets`)
- `POST /tickets/` — create ticket *(employee)*
- `GET /tickets/me` — list my tickets
- `GET /tickets/assigned` — list assigned tickets *(agent)*
- `GET /tickets/` — list all tickets *(admin)*
- `GET /tickets/{id}` — view ticket
- `PATCH /tickets/{id}` — edit ticket
- `PATCH /tickets/{id}/assign` — assign to agent *(admin)*
- `PATCH /tickets/{id}/status` — change status *(agent)*
- `PATCH /tickets/{id}/close` — close ticket *(agent/admin)*

### Users (`/users`)
- `GET /users/` — list all users *(admin)*
- `GET /users/{id}` — get user *(admin)*
- `POST /users/create-user` — create user *(admin)*
- `PATCH /users/{id}/role` — change role *(admin)*
- `PATCH /users/{id}/reset-password` — reset password *(admin)*
- `DELETE /users/` — delete user *(admin)*

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
- **Centralized config** — pydantic-settings for backend, env-driven API base URL for frontend
- **Database migrations** — never mutate schema outside Alembic
- **Secure secrets** — `.env` ignored, `.env.example` provided as template

---

## 📌 Future Enhancements

- Email notifications on assignment and status change
- File attachments on tickets
- Ticket priority and category tags
- SLA tracking and breach alerts
- Reports & analytics (resolution time, agent workload)
- Audit log for admin actions
- WebSocket-based real-time updates

---

## 👨‍💻 Author

**Puneeth Sai**
Backend Developer — FastAPI, PostgreSQL, Next.js
