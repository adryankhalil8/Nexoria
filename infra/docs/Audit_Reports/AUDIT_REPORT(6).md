# Nexoria Project Audit Report (6)
**Date:** April 20, 2026  
**Scope:** Current full-site audit with deployment excluded from completion scoring  
**Status:** Late-stage full-stack product with public funnel, admin operations, client portal, scheduling, SSE support messaging, tighter client/admin data boundaries, and journey-level tests  
**Priority:** Low to Medium - Remaining work is mostly production hardening when deployment returns to scope plus any capstone-specific presentation polish

---

## Executive Summary

Nexoria is now a coherent three-zone product rather than a loose set of pages:

- **Public site:** homepage, Get Started intake, schedule-call flow, booking confirmation, login, register, and first-admin setup
- **Admin portal:** operations dashboard, client tracker, booked calls, schedule settings, support messages, user manager, blueprint gallery, blueprint creation, and blueprint detail controls
- **Client portal:** scheduled call visibility, approved blueprint view, client-visible fixes, next steps, results snapshot, and support messaging

The strongest improvement since the previous Audit 6 draft is workflow hardening. Client portal data is no longer just filtered in React, support messaging now streams with Server-Sent Events, generated build output has been removed from source control, and journey-level tests cover the most important public/admin/client handoffs.

**Current completion estimate excluding deployment:** `~95%`

---

## 1. Completion Snapshot

```text
Nexoria
|- Public landing funnel ............................. Strong
|- Get Started intake ................................ Working
|- Scheduling and confirmation ....................... Working
|- Admin portal ...................................... Strong
|- Client portal ..................................... Working
|- Support messaging ................................. Working, SSE with polling fallback
|- Auth and protected access ......................... Stronger after role-boundary patch
|- Client blueprint visibility ....................... Server-enforced for approved/visible data
|- Database migrations ............................... Working through V7
|- ERD ............................................... Updated DBML and regenerated PNG
|- README/status docs ................................ Mostly aligned after this audit refresh
|- Repo hygiene ...................................... Generated artifacts untracked; ignore coverage in place
`- Deployment evaluation ............................. Excluded
```

The project is now in a strong capstone-demo state. The main risk is no longer feature existence. The remaining risk is production-readiness polish, deeper edge-case coverage, and keeping docs/tests aligned as small workflows continue to change.

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
- support thread with Server-Sent Events and polling fallback

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
| Backend tests: `mvn --batch-mode test` | Passed, `26` tests |
| Frontend lint: `npm run lint` | Passed |
| Frontend tests: `npm test -- --run` | Passed, `16` tests |
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
- Get Started to Schedule handoff
- booking confirmation to registration handoff
- client registration eligibility
- admin client tracker to blueprint/calls/support handoffs
- client portal blueprint rendering
- support message send/reply behavior

---

## 6. Current Gaps and Risks

### 6.1 Production Hardening Is the Largest Remaining Non-Deployment Gap

**Severity:** Low to Medium

Generated artifacts have been removed from source control and ignore coverage is in place. The main remaining hardening items are production-oriented and still excluded from completion scoring.

Recommended next step:

- Keep generated output out of commits.
- Keep secrets in environment/secret management.
- Add release/rollback and backup guidance if deployment returns to scope.

### 6.2 Test Coverage Is Green but Still Not Journey-Deep

**Severity:** Medium

The tests pass and now include journey-level coverage. More edge-case tests could still be added, but the main capstone paths are represented.

Recommended next tests:

- invalid/expired token refresh edge cases
- support stream disconnect/reconnect behavior
- schedule settings edge cases around overlapping windows
- admin blueprint save failure states

### 6.3 Support Messaging Uses SSE, With Polling Fallback

**Severity:** Low

Support messaging persists and streams new messages through Server-Sent Events. The frontend keeps a polling fallback for stream failures.

Recommended next step:

- Add an automated backend test around SSE stream registration if desired.
- Keep the fallback behavior documented.

### 6.4 Client Portal Metrics Are Still Placeholder-Oriented

**Severity:** Improved

The client portal now clearly states when tracking is not connected and lists the missing integrations instead of presenting placeholder metrics as final truth.

Recommended next step:

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
| Support messaging | Strong | Persistent client/admin flow with SSE and fallback polling |
| Auth/access control | Stronger | Client/admin route and API boundaries tightened |
| Backend/API | Strong | Tests pass and migrations validate through V7 |
| Database/ERD | Good | DBML source reflects active schema; image regeneration remains a maintenance step |
| Frontend QA | Improved | Lint, tests, and build pass |
| Documentation | Improved | README, TODO, ERD DBML, ERD PNG, and Audit 6 updated |
| Repo hygiene | Improved | Generated artifacts untracked and stray non-runtime files removed |
| Deployment | Excluded | Not scored in this audit |

---

## 8. Recommended Next Work

### Phase A: Final Verification

1. Run backend tests after the SSE/support changes.
2. Run frontend lint, tests, and build after journey-test additions.
3. Confirm the working tree no longer tracks generated output.

### Phase B: Edge-Case Confidence

1. Add support stream reconnect tests if time permits.
2. Add schedule-window overlap tests.
3. Add admin blueprint failure-state tests.

### Phase C: Admin Workflow Polish

1. Keep improving visual hierarchy around the operational dashboard.
2. Add unread persistence if admin users need durable read/unread state.
3. Add richer "ready for client review" checks if the blueprint workflow grows.

### Phase D: Documentation and ERD Maintenance

1. Regenerate `infra/docs/erd.png` from `infra/docs/erd.dbml` after future schema changes.
2. Keep README route maps and migrations current.
3. Keep Audit 6 or future audits aligned with actual test counts.

---

## 9. Sixth Audit Summary

Nexoria is in a strong late-stage capstone position with deployment excluded. The major product journeys exist and are now more logically connected: public intake, scheduling, registration eligibility, admin operations, client portal, approved blueprint visibility, and support messaging.

The biggest improvement in the current state is that the final polish items are no longer theoretical: generated artifacts were removed from source control, support moved to SSE, client results now state tracking truthfully, and journey-level tests cover the core flow.

The biggest remaining risk is production readiness, which remains excluded from scoring. For the non-deployment capstone scope, the project is now very close to final.

**Updated completion estimate excluding deployment:** `~95%`
