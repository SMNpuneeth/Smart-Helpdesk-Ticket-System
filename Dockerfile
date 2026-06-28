# ==========================================
# Smart Helpdesk Ticket System - Backend
# ==========================================
# Multi-stage build for a small production image.
# Build:  docker build -t helpdesk-backend .
# Run:    docker run --env-file .env -p 8000:8000 helpdesk-backend

# ---------- Stage 1: build dependencies ----------
FROM python:3.12-slim AS builder

WORKDIR /app

# System deps for building wheels (psycopg2-binary is prebuilt, but keep this
# in case you swap to psycopg or need to compile anything in the future).
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python deps into a prefix we can copy to the runtime stage.
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir --prefix=/install -r requirements.txt

# ---------- Stage 2: runtime ----------
FROM python:3.12-slim AS runtime

WORKDIR /app

# Runtime system deps only (libpq for psycopg2, curl for the healthcheck).
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user for the app.
RUN useradd --create-home --shell /bin/bash appuser

# Copy installed Python packages from the builder.
COPY --from=builder /install /usr/local

# Copy application source.
COPY --chown=appuser:appuser . .

USER appuser

EXPOSE 8000

# Run migrations, then start uvicorn. The startup command waits for the DB to
# be reachable by retrying alembic a few times — see entrypoint.sh.
COPY --chown=appuser:appuser entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
