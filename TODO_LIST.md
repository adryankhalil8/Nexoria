# Nexoria Project TODO List
**Based on the current codebase state - March 26, 2026**  
**Status:** ~75% Complete - React frontend unified, secure backend baseline in place, Phase 5 completed

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
- [ ] Expand backend unit coverage for scoring and token edge cases
- [x] Create backend integration tests
- [x] Set up Vitest for the frontend
- [x] Create initial frontend component tests
- [ ] Expand React route and blueprint flow coverage
- [ ] Re-verify lint and formatting discipline across the current frontend

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
- [ ] Add broader test coverage for create, gallery, and detail routes

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
- [ ] Remove generated build artifacts from source control where appropriate
- [ ] Add or tighten `.gitignore` coverage for local build output and secrets
- [ ] Update `README.md` with the current React-first app flow

---

## Current Verification Snapshot

- [x] Backend tests passing
- [x] Frontend build passing
- [x] Frontend component tests passing

---

## Current Priorities

1. Expand React coverage around blueprint creation, gallery filtering, and detail flows
2. Harden auth and session behavior, especially refresh-token lifecycle and navigation edge cases
3. Improve production operations readiness around HTTPS, secrets, and release process
