# Nexoria

Nexoria is a full-stack web app for selling and operating an AI operator install. The project combines:

- a React + Vite frontend for the landing page, auth flow, blueprint flow, and admin workspace
- a Spring Boot backend for authentication, protected API endpoints, health checks, and persistence
- Flyway migrations for schema management
- MySQL for the default runtime path
- H2 for the local backend profile and test runs

## Project Structure

- `frontend/` - React app
- `backend/` - Spring Boot API
- `infra/` - docs, ADRs, audit reports, and deployment artifacts
- `docker-compose.yml` - local Docker stack
- `docker-compose.prod.yml` - production-oriented Compose stack

## Tech Stack

- Frontend: React 18, TypeScript, Vite, React Router, Axios
- Backend: Java 21, Spring Boot 3.3, Spring Security, Spring Data JPA
- Database: MySQL 8.4, H2
- Migrations: Flyway
- Docs/API: Springdoc OpenAPI / Swagger UI

## Running Locally

There are two good ways to run Nexoria locally.

### Option 1: Fastest local dev path

This is the easiest path if you want to work on the app without setting up MySQL first.

#### 1. Start the backend with the local profile

From PowerShell:

```powershell
cd C:\Users\adryan.jefferson\Desktop\IdeaProjects\Nexoria\backend
$env:SPRING_PROFILES_ACTIVE="local"
$env:JWT_SECRET=[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
$env:ADMIN_BOOTSTRAP_SECRET="peoapleaccent#1"
mvn spring-boot:run
```

What this does:

- runs the Spring Boot API on `http://localhost:8080`
- uses the `local` profile in `backend/src/main/resources/application-local.yml`
- uses in-memory H2 instead of MySQL

#### 2. Start the frontend

Open a second PowerShell window:

```powershell
cd C:\Users\adryan.jefferson\Desktop\IdeaProjects\Nexoria\frontend
npm install
npm run dev
```

The frontend runs on:

- `http://127.0.0.1:3000`

If needed, create `frontend/.env` from `frontend/.env.example`:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

#### 3. Open the app

- Landing page: `http://127.0.0.1:3000`
- Get Started intake: `http://127.0.0.1:3000/get-started`
- Schedule call: `http://127.0.0.1:3000/schedule`
- Register: `http://127.0.0.1:3000/register`
- Login: `http://127.0.0.1:3000/login`
- Admin setup: `http://127.0.0.1:3000/admin-access`
- Admin overview: `http://127.0.0.1:3000/admin`
- Client portal: `http://127.0.0.1:3000/portal`
- Backend health: `http://localhost:8080/actuator/health`
- Swagger UI: `http://localhost:8080/swagger-ui.html`

### Option 2: Full Docker stack

Use this if you want the frontend, backend, and MySQL all running together in containers.

#### 1. Create a root `.env`

Copy the root example:

```powershell
Copy-Item .env.example .env
```

At minimum, set:

- `DB_NAME`
- `DB_USERNAME`
- `DB_PASSWORD`
- `DB_ROOT_PASSWORD`
- `JWT_SECRET`
- `ADMIN_BOOTSTRAP_SECRET`

Important:

- `JWT_SECRET` should be a Base64-encoded 256-bit secret
- `ADMIN_BOOTSTRAP_SECRET` is used only to create the first admin account through `/admin-access`
- the default local compose profile uses MySQL

#### 2. Start the stack

```powershell
docker compose up --build
```

Then open:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8080`

## Local Environment Notes

- The backend default profile uses MySQL from `backend/src/main/resources/application.yml`
- The local profile uses H2 from `backend/src/main/resources/application-local.yml`
- Flyway migrations live in `backend/src/main/resources/db/migration/`
- The active schema migration order is:
  - `V1__init_schema.sql`
  - `V2__add_user_ownership.sql`
  - `V3__admin_portal_schema.sql`
  - `V4__client_portal_fields.sql`
  - `V5__scheduling.sql`
  - `V6__client_access_and_assignments.sql`
  - `V7__support_messages.sql`

## Product Route Map

Public routes:

- `/` - sales landing page
- `/get-started` - intake and first-pass diagnostic preview
- `/schedule` - book a 45-minute call from configured availability
- `/schedule/confirmation` - booking success and next-step handoff
- `/login`, `/register`, `/admin-access` - authentication and first-admin bootstrap

Admin routes:

- `/admin` - operations dashboard
- `/admin/clients` - lead and client tracker
- `/admin/calls` - booked call queue
- `/admin/schedule` - configurable availability windows
- `/admin/support` - client support messages and replies
- `/admin/users` - account management
- `/admin/blueprints`, `/admin/blueprints/new`, `/admin/blueprints/:id` - blueprint creation, assignment, approval, task ownership, task status, and client visibility controls

Client portal routes:

- `/portal` - scheduled call and current execution summary
- `/portal/blueprint` - approved blueprint preview and visible fixes
- `/portal/next-steps` - client-facing task board
- `/portal/results` - KPI snapshot and tracking state
- `/portal/support` - support thread with Server-Sent Events and polling fallback

## Workflow Notes

- `Book a Call` and completed `Get Started` flows both route into scheduling.
- A booked call creates the client handoff point and allows that email to register for client portal access.
- Admins can mark leads closed, assign blueprints by client email, approve/archive blueprint status, choose the purchase event type, assign fix ownership, update fix status, and decide which fixes are visible to the client.
- Support messaging is persistent and streams updates with Server-Sent Events. If the stream drops, the UI falls back to polling.

## Useful Commands

### Backend

Run tests:

```powershell
cd backend
mvn --batch-mode test
```

Package the app:

```powershell
cd backend
mvn -DskipTests clean package
```

### Frontend

Run the production build:

```powershell
cd frontend
npm run build
```

Run tests:

```powershell
cd frontend
npm run test -- --run
```

Note:

- the backend tests, frontend build, frontend lint, and frontend test suite currently pass as of Audit Report 6

## Deployment Requirements

This repo includes a production-oriented Compose path, but deployment still requires a few things to be configured intentionally.

### Infrastructure you need

- a host or VM that can run Docker and Docker Compose
- a public domain name
- reverse proxy / web server access on ports `80` and ideally `443`
- persistent storage for MySQL

### Environment variables you need

At minimum:

```env
DB_NAME=nexoria
DB_USERNAME=your_app_user
DB_PASSWORD=your_database_password
DB_ROOT_PASSWORD=your_root_password
JWT_SECRET=your_base64_encoded_256_bit_secret
ADMIN_BOOTSTRAP_SECRET=your_private_admin_bootstrap_secret
APP_DOMAIN=your-domain.com
APP_CORS_ALLOWED_ORIGIN=https://your-domain.com
SPRING_PROFILES_ACTIVE=prod
```

Optional but recommended:

- `APP_SECURITY_CSP`
- `APP_RATE_LIMIT_AUTH_CAPACITY`
- `APP_RATE_LIMIT_AUTH_WINDOW`

### What the current production stack expects

The production Compose stack in `docker-compose.prod.yml` expects:

- MySQL service
- backend service built from the root `Dockerfile`
- frontend service built from `frontend/Dockerfile`
- Nginx reverse proxy using `infra/nginx/nexoria.conf`

### Recommended deployment checklist

Before deploying, make sure you have:

1. A strong Base64 `JWT_SECRET`
2. Real production database credentials
3. A configured domain name
4. TLS/HTTPS enabled at the reverse proxy or load balancer
5. CORS set to your real frontend origin
6. A plan for MySQL backups and restore
7. A release process for rebuilding and restarting containers safely

## Production Deploy Example

After creating a production `.env`, you can start the production stack with:

```powershell
docker compose -f docker-compose.prod.yml up --build -d
```

## Current Gaps To Be Aware Of

These do not stop local development, but they matter for maintenance and deployment quality:

- `infra/docs/erd.png` should be regenerated from `infra/docs/erd.dbml` after future schema changes
- frontend test coverage has journey-level coverage now, but can still expand around edge cases
- HTTPS is expected in deployment, but certificate management is not fully handled in-repo

## Docs

Additional project docs live under `infra/docs/`, including:

- audit reports
- ADRs
- API design notes
- deployment guide

## Quick Start Summary

If you just want the app running as fast as possible:

1. Start backend with the `local` profile
2. Start the frontend with `npm run dev`
3. Open `http://127.0.0.1:3000`

That gives you the cleanest local path for development and demo work.
