# Nexoria File Structure

## Top-Level Structure

```text
Nexoria/
|- backend/                Spring Boot API, security, persistence, Flyway migrations, backend tests
|- frontend/               React + Vite app, routes, pages, API clients, frontend tests
|- infra/                  Architecture docs, ADRs, audit reports, ERD, deployment assets, nginx config
|- .github/                CI workflow and repository automation
|- docker-compose.yml      Local multi-service stack
|- docker-compose.prod.yml Production-oriented Compose stack
|- Dockerfile              Backend/root image build
|- README.md               Main project overview and run guide
`- TODO_LIST.md            Project task notes
```

## Backend

```text
backend/
|- src/main/java/com/nexoria/api/
|  |- auth/                Login, registration, JWT, bootstrap admin
|  |- blueprint/           Blueprint CRUD, scoring, task/fix visibility
|  |- common/              Shared exception handling
|  |- config/              Security, rate-limit, OpenAPI properties
|  |- lead/                Lead tracking and qualification logic
|  |- schedule/            Availability, booking, schedule settings
|  |- security/            Security filter chain, JWT filter, auth rate limiting
|  |- support/             Support thread persistence and delivery
|  |- user/                User management, roles, current-user summaries
|  `- NexoriaApiApplication.java
|- src/main/resources/
|  |- application.yml
|  |- application-dev.yml
|  |- application-local.yml
|  |- application-prod.yml
|  `- db/migration/        Flyway schema migrations V1-V7
`- src/test/               Backend unit and integration tests
```

## Frontend

```text
frontend/
|- src/
|  |- api/                 Axios client and feature API wrappers
|  |- assets/              Images and static app assets
|  |- auth/                Session persistence helpers
|  |- components/          Shared UI layouts and reusable components
|  |- model/               Frontend domain models and computed views
|  |- pages/               Public, admin, and client-facing route pages
|  |- routes/              Protected route handling
|  |- styles/              Global styling
|  `- test/                Frontend workflow and route tests
|- index.html
|- package.json
|- vite.config.ts
`- vitest.config.ts
```

## Infrastructure and Docs

```text
infra/
|- docs/
|  |- adr/                 Architecture decision records
|  |- Audit_Reports/       Incremental project audits
|  |- postman/             API collection and local environment files
|  |- api-design.md
|  |- architecture-diagram.md
|  |- current-status.md
|  |- deployment-guide.md
|  |- erd.dbml
|  |- erd-diagram.md
|  |- erd.png
|  |- file-structure.md
|  `- project-proposal.md
`- nginx/
   `- nexoria.conf         Reverse-proxy configuration for production stack
```

## Notes

- `backend/target/`, `frontend/dist/`, `frontend/node_modules/`, and other generated directories are build artifacts, not source-of-truth project structure.
- The ERD source of truth is [erd.dbml](/c:/Users/adryan.jefferson/Desktop/IdeaProjects/Nexoria/infra/docs/erd.dbml:1).
- The schema source of truth is the Flyway migration set under `backend/src/main/resources/db/migration/`.
