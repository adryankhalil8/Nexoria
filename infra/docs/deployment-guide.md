# Nexoria Deployment Guide

## Runtime Topology

- `frontend`: Vite-built static site served by Nginx
- `backend`: Spring Boot API on port `8080`
- `mysql`: MySQL 8.4 database
- `reverse-proxy`: Nginx entry point for production traffic

## Prerequisites

- Java 21
- Node.js 20+
- Docker and Docker Compose
- A base64-encoded JWT secret with at least 256 bits of entropy

Example PowerShell command to generate a JWT secret:

```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

## Local Development

### Option 1: Run services directly

Backend:

```powershell
cd backend
mvn spring-boot:run
```

Frontend:

```powershell
cd frontend
npm ci
npm run dev
```

### Option 2: Run the local Docker stack

```powershell
docker compose up --build
```

Local service URLs:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8080/api`
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- Health check: `http://localhost:8080/actuator/health`
- MySQL: `localhost:3306`

## Required Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `DB_HOST` | Yes | MySQL host for the backend |
| `DB_PORT` | Yes | MySQL port |
| `DB_NAME` | Yes | Schema/database name |
| `DB_USERNAME` | Yes | Application database user |
| `DB_PASSWORD` | Yes | Application database password |
| `DB_ROOT_PASSWORD` | Docker only | Root password used by the MySQL container |
| `JWT_SECRET` | Yes | Base64-encoded signing key for JWTs |
| `SPRING_PROFILES_ACTIVE` | Recommended | `dev` or `prod` |
| `APP_CORS_ALLOWED_ORIGIN` | Production | Allowed browser origin |
| `APP_RATE_LIMIT_AUTH_CAPACITY` | Optional | Max auth requests per window |
| `APP_RATE_LIMIT_AUTH_WINDOW` | Optional | ISO-8601 duration, ex. `PT1M` |
| `APP_SECURITY_CSP` | Optional | Content-Security-Policy value |

## Production Deployment With Docker Compose

1. Create a production `.env` file from `.env.example`.
2. Set `SPRING_PROFILES_ACTIVE=prod`.
3. Set `APP_CORS_ALLOWED_ORIGIN` to the public frontend origin.
4. Set a strong `JWT_SECRET`.
5. Start the stack:

```powershell
docker compose -f docker-compose.prod.yml --env-file .env up -d --build
```

Production entry points:

- App: `http://<host>/`
- API: `http://<host>/api`
- Health: `http://<host>/actuator/health`
- Swagger UI: `http://<host>/swagger-ui/`

## Reverse Proxy Behavior

`infra/nginx/nexoria.conf` routes traffic like this:

- `/` -> frontend container
- `/api/` -> backend container
- `/actuator/health` -> backend health endpoint
- `/swagger-ui/` and `/v3/api-docs` -> backend API docs

## Health Checks

- Spring Boot exposes `GET /actuator/health`
- Database connectivity is included through the default actuator health contributors
- The production backend container includes a Docker health check against the actuator endpoint
- MySQL includes a `mysqladmin ping` health check

## CI/CD Flow

GitHub Actions in `.github/workflows/ci.yml` performs:

- Backend Maven verify
- Frontend lint, test, and build
- Trivy filesystem scan for high/critical issues
- Artifact upload for backend and frontend outputs
- Automatic GHCR image publishing on pushes to `main`

Published image names:

- `ghcr.io/<owner>/nexoria-backend`
- `ghcr.io/<owner>/nexoria-frontend`

## Production Hardening Checklist

- Keep `JWT_SECRET`, DB passwords, and root DB credentials outside version control
- Terminate TLS ahead of Nginx or extend the reverse proxy config for HTTPS
- Restrict `APP_CORS_ALLOWED_ORIGIN` to the real frontend domain
- Review `APP_SECURITY_CSP` before enabling third-party scripts
- Monitor `429 Too Many Requests` on auth endpoints for abuse spikes
- Rotate credentials and redeploy on a regular schedule
