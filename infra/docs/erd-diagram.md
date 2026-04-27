# Nexoria ERD Diagram

Updated: April 26, 2026  
Source of truth: `backend/src/main/resources/db/migration/` and `infra/docs/erd.dbml`

```mermaid
erDiagram
    USERS {
        bigint id PK
        varchar email UK
        varchar username UK
        varchar password_hash
        varchar role
        varchar status
        timestamp created_at
        timestamp updated_at
    }

    BLUEPRINTS {
        bigint id PK
        bigint user_id FK
        varchar url
        varchar industry
        varchar revenue_range
        varchar client_email
        int score
        boolean ready_for_retainer
        varchar status
        varchar purchase_event_type
        double windspeed
        int weathercode
        double temperature
        timestamp created_at
        timestamp updated_at
    }

    BLUEPRINT_GOALS {
        bigint blueprint_id FK
        varchar goal
    }

    BLUEPRINT_FIXES {
        bigint blueprint_id FK
        varchar title
        varchar impact
        varchar effort
        varchar why
        varchar owner
        varchar status
        boolean client_visible
    }

    LEADS {
        bigint id PK
        bigint user_id FK
        varchar company
        varchar contact_name
        varchar email
        varchar website
        varchar industry
        varchar notes
        varchar status
        timestamp created_at
        timestamp updated_at
    }

    SCHEDULE_SETTINGS {
        bigint id PK
        varchar timezone
        int slot_duration_minutes
        int booking_horizon_days
    }

    AVAILABILITY_WINDOWS {
        bigint id PK
        varchar day_of_week
        time start_time
        time end_time
        boolean active
    }

    SCHEDULED_CALLS {
        bigint id PK
        bigint lead_id FK
        varchar source
        varchar status
        varchar company
        varchar contact_name
        varchar email
        varchar website
        varchar industry
        varchar notes
        timestamp scheduled_start
        timestamp scheduled_end
        varchar timezone
        timestamp created_at
        timestamp updated_at
    }

    SUPPORT_MESSAGES {
        bigint id PK
        bigint client_user_id FK
        varchar client_email
        varchar business_name
        varchar sender
        varchar body
        timestamp created_at
    }

    USER_ROLE_ENUM {
        enum USER
        enum ADMIN
        enum VIEWER
    }

    USER_STATUS_ENUM {
        enum ACTIVE
        enum PENDING
    }

    LEAD_STATUS_ENUM {
        enum NEW
        enum CONTACTED
        enum BOOKED
        enum QUALIFIED
        enum CLOSED
    }

    BLUEPRINT_STATUS_ENUM {
        enum DRAFT
        enum SUBMITTED
        enum APPROVED
        enum ARCHIVED
    }

    PURCHASE_EVENT_TYPE_ENUM {
        enum PURCHASE
        enum DEPOSIT
        enum BOOKED_JOB
    }

    TASK_OWNER_ENUM {
        enum CLIENT
        enum NEXORIA
        enum SHARED
    }

    TASK_STATUS_ENUM {
        enum NOT_STARTED
        enum IN_PROGRESS
        enum BLOCKED
        enum DONE
    }

    CALL_SOURCE_ENUM {
        enum BOOK_A_CALL
        enum GET_STARTED
    }

    SCHEDULED_CALL_STATUS_ENUM {
        enum BOOKED
        enum CLEARED
    }

    SUPPORT_MESSAGE_SENDER_ENUM {
        enum CLIENT
        enum ADMIN
    }

    USERS ||--o{ BLUEPRINTS : owns
    USERS ||--o{ LEADS : registers_from
    USERS ||--o{ SUPPORT_MESSAGES : sends_or_receives
    BLUEPRINTS ||--o{ BLUEPRINT_GOALS : has
    BLUEPRINTS ||--o{ BLUEPRINT_FIXES : has
    LEADS ||--o{ SCHEDULED_CALLS : books
    USER_ROLE_ENUM ||--o{ USERS : role
    USER_STATUS_ENUM ||--o{ USERS : status
    LEAD_STATUS_ENUM ||--o{ LEADS : status
    BLUEPRINT_STATUS_ENUM ||--o{ BLUEPRINTS : status
    PURCHASE_EVENT_TYPE_ENUM ||--o{ BLUEPRINTS : purchase_event_type
    TASK_OWNER_ENUM ||--o{ BLUEPRINT_FIXES : owner
    TASK_STATUS_ENUM ||--o{ BLUEPRINT_FIXES : status
    CALL_SOURCE_ENUM ||--o{ SCHEDULED_CALLS : source
    SCHEDULED_CALL_STATUS_ENUM ||--o{ SCHEDULED_CALLS : status
    SUPPORT_MESSAGE_SENDER_ENUM ||--o{ SUPPORT_MESSAGES : sender
```

## Application-Level Links

Some product relationships are enforced by service logic rather than database foreign keys:

- `blueprints.client_email` matches `users.email` for approved client-portal blueprint access.
- `scheduled_calls.email` matches `users.email` for the client scheduled-call card.
- `support_messages.client_email` groups admin/client support threads.
- Client registration is allowed only when a matching lead email has `BOOKED` or `CLOSED` status.
- Lead deletion clears `scheduled_calls.lead_id` before removing the lead.
- User deletion clears `leads.user_id` and `support_messages.client_user_id` before removing the user.
- The enum boxes in the Mermaid diagram are logical type nodes so the Markdown view matches DBML Live Preview. They are not physical lookup tables in MySQL.

## Compatibility Notes

- Enum values are persisted as `VARCHAR(50)` in the Flyway schema.
- `score`, `ready_for_retainer`, `windspeed`, `weathercode`, and `temperature` remain in the database for compatibility, but they are no longer part of the active product flow.
- `schedule_settings` and `availability_windows` are operational scheduling tables. They do not currently require foreign keys to user accounts.
