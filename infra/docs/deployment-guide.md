# Deployment Guide

## Local Development

1. Backend
   - Configure `backend/src/main/resources/application.yml` and/or `.env` values.
   - Run the app: `cd backend && mvn spring-boot:run`

2. Frontend
   - Run: `cd frontend && npm install && npm run dev`

3. Database
   - Start Postgres (recommended via Docker):
     `docker run --rm -e POSTGRES_DB=nexoria -e POSTGRES_USER=nexoria -e POSTGRES_PASSWORD=nexoria -p 5432:5432 postgres:15`

## Production
1. Build backend: `cd backend && mvn -DskipTests package`
2. Build frontend: `cd frontend && npm install && npm run build`
3. Copy frontend dist to web host and point to backend API.
4. Configure environment variables:
   - `SPRING_DATASOURCE_URL`
   - `SPRING_DATASOURCE_USERNAME`
   - `SPRING_DATASOURCE_PASSWORD`
   - `JWT_SECRET`
   - `SPRING_PROFILES_ACTIVE=prod`

## Env variable matrix
| Variable | Purpose | Default |
|----------|---------|---------|
| POSTGRES_URL | Database connection | jdbc:postgresql://localhost:5432/nexoria |
| POSTGRES_USER | DB user | nexoria |
| POSTGRES_PASSWORD | DB password | nexoria |
| JWT_SECRET | JWT signing key | change-me-please |
| CONFIG_WEIGHT_INDUSTRY | score weight | 20 |
| CONFIG_WEIGHT_GOALS | score weight | 30 |
| CONFIG_WEIGHT_REVENUE | score weight | 20 |
| CONFIG_WEIGHT_EXTERNAL | score weight | 30 |
