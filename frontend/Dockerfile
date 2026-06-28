# ==========================================
# Smart Helpdesk Ticket System - Frontend
# ==========================================
# Multi-stage Next.js build.
# Build:  docker build -t helpdesk-frontend .
# Run:    docker run -p 3000:3000 helpdesk-frontend
#         (talks to backend over the Docker network via the rewrite to "backend")

# ---------- Stage 1: install dependencies ----------
FROM node:20-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# ---------- Stage 2: build ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy deps from the previous stage.
COPY --from=deps /app/node_modules ./node_modules

# Copy the rest of the frontend source.
COPY . .

# Disable Next.js telemetry.
ENV NEXT_TELEMETRY_DISABLED=1

# Build the production bundle.
RUN npm run build

# ---------- Stage 3: runtime ----------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Create a non-root user.
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Copy the public folder (if any) and the standalone build output.
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Next.js standalone output keeps the image small.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# Healthcheck against the home page.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

CMD ["node", "server.js"]
