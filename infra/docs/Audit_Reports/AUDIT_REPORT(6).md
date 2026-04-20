# Nexoria Project Audit Report (6)
**Date:** April 20, 2026  
**Scope:** Current full-site audit with deployment excluded from completion scoring  
**Status:** Late-stage full-stack product with public funnel, admin operations, client portal, scheduling, support messaging, and tighter client/admin data boundaries  
**Priority:** Medium - Remaining work is mostly journey-level test depth, repo hygiene, and production hardening when deployment returns to scope

---

## Executive Summary

Nexoria is now a coherent three-zone product rather than a loose set of pages:

- **Public site:** homepage, Get Started intake, schedule-call flow, booking confirmation, login, register, and first-admin setup
- **Admin portal:** operations dashboard, client tracker, booked calls, schedule settings, support messages, user manager, blueprint gallery, blueprint creation, and blueprint detail controls
- **Client portal:** scheduled call visibility, approved blueprint view, client-visible fixes, next steps, results snapshot, and support messaging

The strongest improvement since the previous Audit 6 draft is access-control depth. Client portal data is no longer just filtered in React. The backend now restricts client "mine" endpoints to client roles and returns only approved, client-visible blueprint data to non-admin users.

**Current completion estimate excluding deployment:** `~91%`

---

## 1. Completion Snapshot

```text
Nexoria
|- Public landing funnel ............................. Strong
|- Get Started intake ................................ Working
|- Scheduling and confirmation ....................... Working
|- Admin portal ...................................... Strong
|- Client portal ..................................... Working
|- Support messaging ................................. Working, polling-based
|- Auth and protected access ......................... Stronger after role-boundary patch
|- Client blueprint visibility ....................... Server-enforced for approved/visible data
|- Database migrations ............................... Working through V7
|- ERD ............................................... Updated source, PNG regeneration still a maintenance step
|- README/status docs ................................ Mostly aligned after this audit refresh
|- Repo hygiene ...................................... Improved ignore coverage; tracked generated artifacts remain noisy
`- Deployment evaluation ............................. Excluded
```

The project is now in a strong capstone-demo state. The main risk is no longer feature existence. The remaining risk is confidence: deeper journey tests, cleanup of generated files, and production-readiness decisions.

---

## 2. Current Product Flow

### Public Funnel

- Homepage routes visitors into `Get Started` or `Book a Call`.
- `Get Started` captures URL, industry, revenue range, and goals.
- Intake state is passed into scheduling so the booked call can create a useful lead and blueprint handoff.
- Scheduling reserves configured 45-minute slots and removes booked slots from public availability.
- Confirmation gives the user a next-step path back home or toward account creation.

### Admin Portal

Current admin routes:

- `/admin`
- `/admin/clients`
- `/admin/calls`
- `/admin/schedule`
- `/admin/support`
- `/admin/users`
- `/admin/blueprints`
- `/admin/blueprints/new`
- `/admin/blueprints/:id`

Admin can now:

- review client tracker records
- see booked calls with business/contact context
- configure schedule availability
- manage users
- create and assign blueprints
- set blueprint approval status
- choose purchase event type
- assign fix owner and status
- decide which fixes are visible to the client
- review and reply to support messages

### Client Portal

Current client routes:

- `/portal`
- `/portal/blueprint`
- `/portal/next-steps`
- `/portal/results`
- `/portal/support`

Client portal now shows:

- first-name personalization in the sidebar
- scheduled call information
- current approved blueprint
- selected intake goals
- only client-visible fixes
- next-step/task-style view
- results snapshot placeholders
- support thread with polling refresh

---

## 3. Backend and Database State

Active backend domains:

- `auth`
- `blueprint`
- `lead`
- `schedule`
- `security`
- `support`
- `user`

Flyway migrations currently present:

- `V1__init_schema.sql`
- `V2__add_user_ownership.sql`
- `V3__admin_portal_schema.sql`
- `V4__client_portal_fields.sql`
- `V5__scheduling.sql`
- `V6__client_access_and_assignments.sql`
- `V7__support_messages.sql`

Core tables represented by current ERD/source:

- `users`
- `leads`
- `blueprints`
- `blueprint_goals`
- `blueprint_fixes`
- `schedule_settings`
- `availability_windows`
- `scheduled_calls`
- `support_messages`

Important relationships:

- `blueprints.user_id -> users.id`
- `blueprints.client_email` assigns approved blueprints to client portal accounts
- `leads.user_id -> users.id`
- `scheduled_calls.lead_id -> leads.id`
- `support_messages.client_user_id -> users.id`

---

## 4. Security and Access Control

Security is stronger than earlier audits:

- Admin frontend routes require `ADMIN`.
- Client portal routes require `USER`.
- Incorrect frontend role access redirects to the correct portal area.
- Backend admin endpoints remain admin-only.
- `/api/scheduling/bookings/mine` now requires `USER` or `VIEWER`, not merely any authenticated account.
- `/api/support/messages/mine` now requires `USER` or `VIEWER`, not merely any authenticated account.
- Blueprint writes remain admin-only.
- Client blueprint reads are server-filtered to approved blueprints only.
- Client blueprint reads strip hidden/internal fixes and return only `clientVisible` fixes.

Remaining security considerations:

- Blueprint assignment is still email-based. That is acceptable for a capstone/demo, but a production version should move toward stronger direct account ownership.
- Local README commands now use a placeholder bootstrap secret, but real local `.env` values must stay uncommitted.
- Generated build/test artifacts are currently noisy in the working tree and should not be part of final source review.

---

## 5. Verification Snapshot

Last verified on April 20, 2026:

| Check | Result |
|------|--------|
| Backend tests: `mvn --batch-mode test` | Passed, `24` tests |
| Frontend lint: `npm run lint` | Passed |
| Frontend tests: `npm test -- --run` | Passed, `8` tests |
| Frontend build: `npm run build` | Passed |
| Flyway migration validation | Passed through `V7` during backend test startup |

Current backend coverage includes:

- auth controller/service/JWT tests
- blueprint controller/repository tests
- scheduling duplicate-booking and duplicate-auto-blueprint tests
- security header/rate-limit tests
- client/admin endpoint boundary tests
- client blueprint approved/client-visible data filtering tests

Current frontend coverage includes:

- navbar rendering
- login rendering
- protected admin/client route boundary behavior

---

## 6. Current Gaps and Risks

### 6.1 Repo Hygiene Is the Loudest Remaining Issue

**Severity:** Medium

The working tree currently shows many generated artifacts under:

- `backend/target`
- `frontend/dist`
- `frontend/node_modules/.vite`

The repo has improved ignore coverage, but existing generated/tracked artifacts still need a deliberate cleanup decision.

Recommended next step:

- Remove generated artifacts from source control where appropriate.
- Keep `.gitignore` active for future build/test output.
- Decide whether to remove stray non-runtime files such as root `BlueprintRequest.java` and `frontend/src/main/java/org/example/Main.java`.

### 6.2 Test Coverage Is Green but Still Not Journey-Deep

**Severity:** Medium

The tests pass, but the most valuable user journeys still need direct frontend/integration coverage.

Recommended next tests:

- public intake -> schedule handoff
- schedule confirmation -> registration path
- client registration eligibility from booked/closed leads
- admin client tracker -> blueprint creation
- client portal rendering of scheduled call and approved blueprint
- support message send/reply UI behavior

### 6.3 Support Messaging Is Polling-Based

**Severity:** Low to Medium

Support messaging persists and refreshes, but it is not true WebSocket/SSE real-time.

Recommended next step:

- Keep it documented as polling-based unless real-time transport becomes a requirement.
- If real-time is required, add WebSocket or Server-Sent Events after the current workflow is stable.

### 6.4 Client Portal Metrics Are Still Placeholder-Oriented

**Severity:** Medium

The client portal has a strong execution view, but results are still mostly derived/mock-style values rather than live analytics integrations.

Recommended next step:

- Add explicit "tracking not connected" state where needed.
- Later connect real analytics, booking, payment, or CRM sources if that becomes in-scope.

### 6.5 Deployment Is Still Excluded

**Severity:** Not scored

Production-oriented Compose files and deployment docs exist, but deployment is intentionally excluded from capstone completion scoring.

Recommended next step if deployment returns to scope:

- HTTPS/TLS plan
- secret management beyond `.env`
- database backup/restore plan
- release and rollback procedure
- production CORS/domain validation

---

## 7. Capstone Assessment by Area

| Area | Status | Notes |
|------|--------|-------|
| Public site | Strong | Clear CTA funnel with Get Started and Book a Call |
| Intake | Good | Captures business context and passes it into scheduling |
| Scheduling | Strong | Public availability, booking, admin settings, duplicate-booking guard |
| Admin portal | Strong | Operational sections now cover clients, calls, support, users, and blueprints |
| Client portal | Good | Shows scheduled call, approved blueprint, visible fixes, tasks, results, and support |
| Support messaging | Good | Persistent client/admin flow with polling refresh |
| Auth/access control | Stronger | Client/admin route and API boundaries tightened |
| Backend/API | Strong | Tests pass and migrations validate through V7 |
| Database/ERD | Good | DBML source reflects active schema; image regeneration remains a maintenance step |
| Frontend QA | Improved | Lint, tests, and build pass |
| Documentation | Improved | README and TODO updated to current commands and verification status |
| Repo hygiene | Needs cleanup | Generated/tracked artifacts remain noisy |
| Deployment | Excluded | Not scored in this audit |

---

## 8. Recommended Next Work

### Phase A: Repo Cleanup

1. Remove generated build/test artifacts from source control where appropriate.
2. Keep `backend/target`, `frontend/dist`, and cache output ignored.
3. Decide what to do with stray non-runtime files before final review.

### Phase B: Journey-Level Confidence

1. Add frontend tests for intake -> schedule.
2. Add tests for booking confirmation -> registration.
3. Add client portal tests for scheduled call and approved blueprint display.
4. Add admin support-message and booked-call workflow tests.

### Phase C: Admin Workflow Polish

1. Add clearer "needs reply" or unread indicators for support threads.
2. Add quick links between client tracker, booked calls, user record, and assigned blueprint.
3. Add a small "ready for client review" indicator on blueprint detail.

### Phase D: Documentation and ERD Maintenance

1. Regenerate `infra/docs/erd.png` from `infra/docs/erd.dbml` after schema changes.
2. Keep README route maps and migrations current.
3. Keep Audit 6 or future audits aligned with actual test counts.

---

## 9. Sixth Audit Summary

Nexoria is in a strong late-stage capstone position with deployment excluded. The major product journeys exist and are now more logically connected: public intake, scheduling, registration eligibility, admin operations, client portal, approved blueprint visibility, and support messaging.

The biggest improvement in the current state is server-side enforcement of client portal boundaries. Clients now receive only approved blueprint data and only fixes intended for them.

The biggest remaining risk is repo hygiene and test depth. Before final review, the project should clean generated artifacts from the working tree and add a few high-value journey tests.

**Updated completion estimate excluding deployment:** `~91%`
