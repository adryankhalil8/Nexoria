# Nexoria Project Audit Report (4)
**Date:** April 13, 2026  
**Status:** Late-stage Project with Working Local Full-Stack Verification and Expanding Admin Surface (~80% Complete)  
**Priority:** Medium - Core product flow is working end to end, but test alignment, environment clarity, and operational cleanup still need attention

---

## Executive Summary

**Nexoria has advanced beyond the state captured in Audit Report (3), especially in local runnability and admin workflow readiness.** Since the prior audit, the project now has a verified local full-stack path using the React frontend plus Spring Boot backend, the Flyway migration sequence has been corrected, and the admin-focused data model and routes are present in the active application.

### Key Findings from Fourth Audit
- Local backend startup is now practical through a dedicated `local` profile backed by in-memory H2
- Flyway migration ordering has been corrected from duplicate `V2` files to a clean `V1` / `V2` / `V3` sequence
- Admin workspace routes are present in the React app for overview, users, clients, and blueprint management
- Frontend registration behavior is improved: API errors are surfaced more clearly and the API base URL is configurable
- Backend tests pass and the frontend production build passes
- Frontend tests are no longer fully green because one login test still expects the pre-update register link
- Environment documentation remains inconsistent: the active backend config is MySQL plus H2 local, while `backend/.env.example` still points to PostgreSQL

**Progress Since Third Audit:** The project has moved from a secure baseline with good architecture into a more usable, locally verifiable application. The biggest remaining risks are no longer missing core features, but mismatch between documented setup and actual runtime behavior, plus shallow or stale QA coverage in the frontend.

---

## 1. Overall Architecture Assessment

### Current State
```text
Nexoria
|- Backend (Spring Boot API) ......................... Strong baseline with working local profile
|- Frontend React/TypeScript ......................... Active UI including admin routes
`- Infra/Docs/CI ..................................... Good foundation, but some status docs are stale
```

### High-Level Assessment
| Area | Status | Notes |
|------|--------|-------|
| Backend API | Good baseline | Auth, migrations, docs, health checks, and local profile verified |
| Frontend App | Good baseline | Register/login/admin flows are present in the maintained React app |
| Database setup | Improved | MySQL remains the default path; local H2 path now works cleanly |
| Testing | Mixed | Backend tests pass; frontend build passes; frontend test suite has 1 failing assertion |
| Deployment readiness | In progress | Still reasonable for local/demo use, not yet fully production-disciplined |
| Project tracking | Needs refresh | TODO and env examples lag behind the real codebase state |

---

## 2. Backend Audit

### 2.1 Improvements Since Audit (3)

#### Local startup path is now usable
- **Files:**
  - [backend/src/main/resources/application.yml](../../backend/src/main/resources/application.yml)
  - [backend/src/main/resources/application-local.yml](../../backend/src/main/resources/application-local.yml)
- **Status:** The backend now supports a dedicated `local` profile using H2 in MySQL compatibility mode. This removes the need for a working MySQL instance just to verify local application behavior.

#### Flyway migration sequence is now valid
- **Files:**
  - [backend/src/main/resources/db/migration/V1__init_schema.sql](../../backend/src/main/resources/db/migration/V1__init_schema.sql)
  - [backend/src/main/resources/db/migration/V2__add_user_ownership.sql](../../backend/src/main/resources/db/migration/V2__add_user_ownership.sql)
  - [backend/src/main/resources/db/migration/V3__admin_portal_schema.sql](../../backend/src/main/resources/db/migration/V3__admin_portal_schema.sql)
- **Status:** The duplicate `V2` conflict has been resolved and the admin schema migration is now compatible with the local H2 verification path.

#### Admin-oriented schema is now part of the active migration chain
- **File:** [backend/src/main/resources/db/migration/V3__admin_portal_schema.sql](../../backend/src/main/resources/db/migration/V3__admin_portal_schema.sql)
- **Status:** The application schema now reflects the admin portal direction rather than leaving that work as a disconnected frontend-only concept.

### 2.2 Current Backend Risks

| Issue | Severity | Notes |
|------|----------|-------|
| Default startup still points to MySQL and fails without correct credentials | Medium | Local success depends on explicitly activating the `local` profile |
| `backend/.env.example` does not match the active backend setup | Medium | It still advertises PostgreSQL, which is misleading |
| JWT secret handling is still env-based only | Medium | Acceptable for local/dev, not yet mature for real production |
| Build warnings remain in Maven output | Low | `sourceEncoding` and `targetEncoding` plugin warnings should be cleaned up |

---

## 3. Database and Persistence Audit

### Current Persistence Paths
- **Default runtime:** MySQL via [backend/src/main/resources/application.yml](../../backend/src/main/resources/application.yml)
- **Local verification path:** H2 in-memory via [backend/src/main/resources/application-local.yml](../../backend/src/main/resources/application-local.yml)
- **Tests:** H2-backed integration path via backend test configuration and Flyway migrations

### Current Naming and Setup
- The expected MySQL database name remains `nexoria`
- The local H2 path uses `jdbc:h2:mem:nexoria`
- Flyway now validates and applies all three active migrations successfully in test runs

### Remaining Concerns
- The repo still contains stale PostgreSQL example config in [backend/.env.example](../../backend/.env.example)
- Backup, restore, and data lifecycle expectations for the MySQL path are still not documented in a meaningful way
- No indexing or query performance review was part of this audit cycle

---

## 4. Frontend Audit

### 4.1 React App Status

#### Admin workspace is part of the active app
- **Files:**
  - [frontend/src/App.tsx](../../frontend/src/App.tsx)
  - [frontend/src/components/AdminLayout.tsx](../../frontend/src/components/AdminLayout.tsx)
  - [frontend/src/pages/AdminOverview.tsx](../../frontend/src/pages/AdminOverview.tsx)
  - [frontend/src/pages/AdminUsers.tsx](../../frontend/src/pages/AdminUsers.tsx)
  - [frontend/src/pages/AdminClients.tsx](../../frontend/src/pages/AdminClients.tsx)
- **Status:** The active React application includes an admin route tree for overview, users, clients, and blueprints. This is now the real product path, not a side artifact.

#### Frontend API behavior is more practical for local integration
- **Files:**
  - [frontend/src/api/client.ts](../../frontend/src/api/client.ts)
  - [frontend/src/pages/Register.tsx](../../frontend/src/pages/Register.tsx)
- **Status:** The API client now supports a configurable `VITE_API_BASE_URL`, and registration surfaces real API/network failures more clearly instead of collapsing everything into a generic error.

### 4.2 Frontend Quality Snapshot

#### Build passes, but tests are partially stale
- **Files:**
  - [frontend/package.json](../../frontend/package.json)
  - [frontend/src/test/Login.test.tsx](../../frontend/src/test/Login.test.tsx)
- **Status:** `npm run build` passes. `npm run test -- --run` currently fails because the login test still expects `href="/register"` while the app now correctly preserves redirect intent with `href="/register?next=%2Fadmin"`.

### 4.3 Remaining Frontend Risks

| Issue | Severity | Notes |
|------|----------|-------|
| Frontend test suite is not fully green | Medium | A simple assertion mismatch exists, but it weakens confidence signals |
| Coverage remains shallow around admin and blueprint workflows | Medium | Presence of routes is stronger than automated verification of their behavior |
| Protected-route behavior still depends on local storage token checks | Medium | Functional, but still a lightweight session model |
| Legacy non-React artifacts still create confusion | Low | The stale `admin.html` path is not the app, but can still distract contributors |

---

## 5. Full-Stack Verification Snapshot

### Verified in this audit cycle
- Backend tests: `mvn --batch-mode test` passed
- Frontend production build: `npm run build` passed
- Active migration chain: Flyway validated and applied `V1`, `V2`, and `V3` during backend tests

### Verified recently in local integration work
- Backend health endpoint responded successfully on `/actuator/health`
- OpenAPI docs responded successfully on `/v3/api-docs`
- Registration and login worked end to end against the running frontend and backend
- Admin React routes resolved under `/admin`

### Important quality note
- The frontend test suite is not fully passing at the moment, so the project should not be described as fully green on the frontend until that assertion is updated or the behavior is intentionally changed back

---

## 6. Documentation and Tracking Audit

### What is working
- Core architecture and deployment docs from earlier audits are still useful
- The audit trail itself is helping keep the codebase state understandable

### What is drifting
- [TODO_LIST.md](../../../TODO_LIST.md) still says frontend component tests are passing, which is no longer accurate
- [backend/.env.example](../../backend/.env.example) describes a PostgreSQL setup that no longer matches the active application path
- Status artifacts should now reflect the local H2 profile and the admin route expansion

---

## 7. Updated Recommendations

### Phase A: Restore status accuracy
1. Update [TODO_LIST.md](../../../TODO_LIST.md) to reflect the current frontend test failure and current completion state
2. Replace or remove the stale PostgreSQL example in [backend/.env.example](../../backend/.env.example)
3. Document the supported local startup command using the `local` profile

### Phase B: Re-stabilize frontend QA
1. Update [frontend/src/test/Login.test.tsx](../../frontend/src/test/Login.test.tsx) to match the current redirect-preserving register link
2. Add coverage for admin routes and protected navigation behavior
3. Add at least one broader integration path covering register -> login -> admin access

### Phase C: Keep operational maturity moving
1. Clean up Maven compiler plugin warnings
2. Tighten repo hygiene around generated dev artifacts and local outputs
3. Continue documenting production expectations around secrets, HTTPS, and database operations

---

## 8. Fourth Audit Summary

**Current position:** Nexoria is in a better place than Audit Report (3) captured. The app is now more locally runnable, the migration chain is healthier, and the active React app includes the admin workspace the project has been building toward.

**Biggest improvement:** Local full-stack confidence. The addition of a working `local` profile, corrected Flyway ordering, and successful end-to-end auth verification materially reduce the friction of testing and demoing the application.

**Biggest remaining gap:** Alignment, not architecture. The codebase has moved ahead of some of its tests and status documents. The next best step is to make QA signals and setup docs match the real app so the project feels as reliable to maintain as it now is to run.
