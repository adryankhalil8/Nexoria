# Nexoria Current Status

## Project Snapshot

Nexoria is currently a working full-stack platform for:

- public intake and Operator Diagnostic booking
- admin lead, user, support, booked-call, and blueprint management
- gated client registration and client portal access
- blueprint approval and client-visible task delivery
- support messaging with Server-Sent Events and polling fallback

## Active Product Behavior

### Public flow

- homepage and FAQ route are available
- users can start intake through `Get Started`
- intake data is carried into scheduling
- users can book an Operator Diagnostic from public availability
- booking creates or updates a lead and stores a scheduled call
- booking from `Get Started` can seed blueprint creation inputs

### Registration and access

- client registration is gated by lead status
- only `BOOKED` or `CLOSED` lead emails can register
- JWT-based auth is used for admin and client sessions
- role-based route protection is enforced in both frontend and backend

### Admin workspace

- admin dashboard and sidebar navigation are active
- Client Tracker supports search, status filter, edit, internal scrolling, and deletion
- Booked Calls supports search, clear-slot actions, and hard delete
- Support Messages supports thread list, live updates, reply, and thread delete
- User Manager supports status changes and user deletion
- Blueprints supports create, assign to existing clients, approve, archive, update client-visible fixes, and delete

### Client portal

- clients can see scheduled calls associated with their account
- clients can view approved blueprint content
- next steps are generated from client-visible fixes
- results view shows KPI/progress state with honest placeholder behavior when tracking is not connected
- clients can send and receive support messages

## Important Current Rules

- deleting a lead does not delete its blueprint or support thread
- deleting a user does not delete support threads or blueprints
- deleting a booked call does not delete the lead or blueprint
- support threads can be deleted independently by admin
- blueprints can be deleted independently from the blueprint library

## Current Technical Notes

- the active blueprint flow no longer uses scoring in the product UI or saved workflow behavior
- the old external weather/signal feature has been removed from the active frontend and scoring logic
- legacy database columns for score, retainer readiness, and external signal still exist for compatibility, but are not part of the active product behavior
- MySQL schema changes are managed with Flyway migrations `V1` through `V7`
- the backend test suite passed on April 26, 2026 with `31` tests
- the frontend test suite passed on April 26, 2026 with `16` tests
- the frontend production build passed on April 26, 2026
- frontend lint currently fails on unused homepage constants and unescaped apostrophes in schedule page copy

## Documentation Notes

- API behavior is documented in [api-design.md](/c:/Users/adryan.jefferson/Desktop/IdeaProjects/Nexoria/infra/docs/api-design.md:1)
- deployment setup is documented in [deployment-guide.md](/c:/Users/adryan.jefferson/Desktop/IdeaProjects/Nexoria/infra/docs/deployment-guide.md:1)
- data structure is documented in [erd.dbml](/c:/Users/adryan.jefferson/Desktop/IdeaProjects/Nexoria/infra/docs/erd.dbml:1)
- repo layout is documented in [file-structure.md](/c:/Users/adryan.jefferson/Desktop/IdeaProjects/Nexoria/infra/docs/file-structure.md:1)
- the latest audit is [AUDIT_REPORT(8).md](/c:/Users/adryan.jefferson/Desktop/IdeaProjects/Nexoria/infra/docs/Audit_Reports/AUDIT_REPORT(8).md:1)
