# 🎫 Smart Helpdesk Ticket System — FastAPI & PostgreSQL

A secure backend API for managing helpdesk tickets with role-based access control, authentication, and database migrations.

Built using real-world backend engineering practices.

---

## 🚀 About the Project

The Smart Helpdesk Ticket System allows users to raise support tickets and track their progress while admins manage users and ticket workflows securely.

It simulates how enterprise helpdesk platforms operate in production systems.

---

## 🎯 Why This Project Was Built

This project was created to:

- Practice professional backend architecture
- Implement secure authentication and authorization
- Handle real database workflows
- Follow clean and scalable API design
- Simulate real company-level backend systems

---

## 🧠 Core Features

### 👤 User & Admin System
- User registration and login
- Encrypted passwords using bcrypt
- Role-based access control

### 🎫 Ticket Handling
- Create tickets
- Update ticket status
- Track ticket lifecycle

### 🔐 Security
- JWT token authentication
- Protected API endpoints
- Environment-based secrets

### 🗄 Database
- PostgreSQL with SQLAlchemy
- Alembic migrations for schema control

---

## 🛠 Tech Stack (What & Why)

- FastAPI – fast and clean API framework
- SQLAlchemy – ORM for structured database handling
- PostgreSQL – production-grade relational database
- Alembic – version control for database schema
- JWT (python-jose) – secure authentication
- Passlib (bcrypt) – password hashing
- Pydantic – request validation
- dotenv – secret management

---

## 🔁 System Workflow

- User registers or logs in
- JWT token is generated
- Token is required for protected routes
- Users create and manage tickets
- Admin controls users and ticket lifecycle
- Database changes tracked with Alembic

---

## ▶️ How to Run the Project

1. Clone the repository

   git clone https://github.com/SMNpuneeth/Smart-Helpdesk-Ticket-System
   cd Smart-Helpdesk-Ticket-System  

2. Create virtual environment

   python -m venv venv  
   venv\Scripts\activate  

3. Install dependencies

   pip install -r requirements.txt  

4. Create .env file

   DATABASE_URL=postgresql+psycopg2://user:password@localhost:5432/project  
   SECRET_KEY=your_secret_key  
   ALGORITHM=HS256  
   ACCESS_TOKEN_EXPIRE_MINUTES=120  

5. Apply migrations

   alembic upgrade head  

6. Start server

   uvicorn main:app --reload  

Open API docs at:

http://127.0.0.1:8000/docs

---

## ✅ Best Practices Used

- Clean layered architecture
- Secure secrets management
- Role-based authorization
- Database version control
- Production-style backend flow

---

## 📌 Future Enhancements

- Email notifications
- Ticket priorities
- Admin dashboard
- Reports & analytics

---

## 👨‍💻 Author

Puneeth Sai  
Backend Developer — FastAPI & PostgreSQL
