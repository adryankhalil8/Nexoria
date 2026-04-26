# Nexoria Architecture Diagram


## Mermaid Source

```mermaid
flowchart LR
    user[Public User]
    client[Client User]
    admin[Admin User]

    subgraph Browser["Browser / Frontend"]
        landing["Landing + FAQ"]
        intake["Get Started Intake"]
        schedule["Schedule Call"]
        auth["Login / Register / Admin Access"]
        adminUi["Admin Portal"]
        clientUi["Client Portal"]
    end

    subgraph Proxy["Reverse Proxy"]
        nginx["Nginx"]
    end

    subgraph Backend["Spring Boot API"]
        authApi["Auth"]
        leadApi["Leads"]
        schedulingApi["Scheduling"]
        blueprintApi["Blueprints"]
        supportApi["Support SSE"]
        userApi["Users"]
    end

    subgraph Data["Persistence"]
        mysql["MySQL 8"]
        flyway["Flyway Migrations"]
    end

    subgraph Docs["Project Docs"]
        erd["ERD / DBML"]
        deploy["Deployment Guide"]
        proposal["Project Proposal"]
        audits["Audit Reports"]
    end

    user --> landing
    user --> intake
    user --> schedule
    user --> auth

    client --> auth
    client --> clientUi

    admin --> auth
    admin --> adminUi

    landing --> nginx
    intake --> nginx
    schedule --> nginx
    auth --> nginx
    adminUi --> nginx
    clientUi --> nginx

    nginx --> authApi
    nginx --> leadApi
    nginx --> schedulingApi
    nginx --> blueprintApi
    nginx --> supportApi
    nginx --> userApi

    authApi --> mysql
    leadApi --> mysql
    schedulingApi --> mysql
    blueprintApi --> mysql
    supportApi --> mysql
    userApi --> mysql

    flyway --> mysql

    erd -.documents.-> mysql
    deploy -.documents.-> nginx
    proposal -.documents.-> landing
    audits -.documents.-> adminUi
```



## Notes

- Public traffic flows into the landing page, intake flow, scheduling flow, and authentication pages.
- Admin traffic uses the admin portal for leads, calls, schedule settings, users, blueprints, and support.
- Client traffic uses the client portal for approved blueprint views, next steps, results, scheduled calls, and support.
- The backend persists to MySQL and uses Flyway as the schema source of truth.
