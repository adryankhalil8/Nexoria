# Nexoria Project TODO List
**Based on the current codebase state - April 20, 2026**  
**Status:** ~95% complete excluding deployment - public funnel, admin portal, client portal, scheduling, support messaging, and key journey tests are connected

---

## PHASE 1: Security Fixes
*Priority: Critical*

- [x] Remove hardcoded secrets from app config and Compose paths
- [x] Implement JWT service with access and refresh tokens
- [x] Add Spring Security configuration and route protection
- [x] Fix high-priority frontend dependency issues

---

## PHASE 2: Configuration Cleanup
*Priority: High*

- [x] Standardize on MySQL
- [x] Implement Flyway migrations
- [x] Add environment-specific configs
- [ ] Move production secret handling beyond `.env`
- [x] Add input validation annotations
- [x] Implement `GlobalExceptionHandler`

---

## PHASE 3: Authentication Flow
*Priority: High*

- [x] Implement `AuthService.java`
- [x] Implement `AuthController.java`
- [x] Complete `User` entity and repository support
- [x] Implement frontend API client configuration
- [x] Create login and register components
- [x] Implement protected routes
- [x] Add authentication and ownership to blueprint flows

---

## PHASE 4: Testing and Quality
*Priority: Medium*

- [x] Set up backend testing framework
- [x] Add backend coverage for scheduling duplicate booking guards and duplicate Get Started blueprint prevention
- [ ] Expand backend unit coverage for support authorization, scoring, and token edge cases
- [x] Create backend integration tests
- [x] Set up Vitest for the frontend
- [x] Create initial frontend component tests
- [x] Add frontend coverage for protected admin/client route boundaries
- [x] Expand React route coverage for intake -> scheduling, booking confirmation -> registration, admin handoffs, client portal rendering, and support send/reply
- [x] Re-verify lint and production build discipline across the current frontend

---

## PHASE 5: Documentation and Deployment
*Priority: Medium*

- [x] Complete API design documentation
- [x] Update deployment guide
- [x] Complete ADR documents
- [x] Add security headers
- [x] Implement rate limiting
- [x] Add health checks
- [x] Create GitHub Actions workflow
- [x] Add Docker Compose for production

---

## Frontend Consolidation
*Priority: Medium*

- [x] Migrate active frontend flow to React/TypeScript
- [x] Transfer shared blueprint models into the React app
- [x] Replace legacy HTML and JS blueprint pages with React routes
- [x] Remove legacy frontend files from the active app path
- [x] Add public Get Started and scheduling routes
- [x] Add admin routes for clients, booked calls, schedule settings, support messages, users, and blueprints
- [x] Add client portal routes for home, blueprint, next steps, results, and support
- [ ] Add broader test coverage for create, gallery, detail, admin, and client portal routes

---

## Workflow Completion
*Priority: High*

- [x] Separate first-admin bootstrap from normal registration
- [x] Restrict client registration to emails with booked/closed lead status
- [x] Connect booked calls to client tracker readiness
- [x] Show scheduled calls in the client portal
- [x] Show assigned blueprint goals and visible fixes in the client portal
- [x] Add admin controls for blueprint approval, purchase event, task owner/status, and client visibility
- [x] Add support messaging with admin replies and Server-Sent Events plus polling fallback
- [x] Prevent duplicate active bookings for the same email
- [x] Avoid duplicate auto-blueprints from repeated Get Started bookings
- [x] Add journey-level tests for these workflows

---

## Operational Follow-Up
*Priority: Medium*

- [ ] Add HTTPS and TLS deployment guidance or config
- [ ] Define release and rollback procedure
- [ ] Document backup and restore expectations for MySQL
- [ ] Move secrets to a proper production secret-management path

---

## Quick Wins

- [x] Consolidate frontend styling around the React app
- [x] Remove generated build artifacts from source control where appropriate
- [x] Add or tighten `.gitignore` coverage for local build output and secrets
- [x] Update `README.md` with the current React-first app flow
- [x] Removed cleanup candidates from the repo: root `BlueprintRequest.java`, `frontend/src/main/java/org/example/Main.java`, and untracked `backend/package-lock.json`

---

## Current Verification Snapshot

- [x] Backend tests passing: `mvn --batch-mode test` (`26` tests)
- [x] Frontend lint passing: `npm run lint`
- [x] Frontend build passing: `npm run build`
- [x] Frontend journey/component tests passing: `npm test -- --run` (`16` tests)

---

## Current Priorities

1. Keep final verification green as workflow polish continues
2. Improve production operations readiness around HTTPS, secrets, backups, and release process
3. Add any final edge-case tests requested by the capstone rubric
