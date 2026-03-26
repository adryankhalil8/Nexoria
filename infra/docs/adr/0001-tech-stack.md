# ADR 0001: Tech Stack

Decision: Use Java/Spring Boot for backend and React/TypeScript for frontend.

- Backend: Spring Boot 3.3, Spring Data JPA, Spring Security, MySQL, JWT, Spring Actuator, Springdoc OpenAPI.
- Frontend: Vite, React 18, TypeScript, React Router, Axios.
- Legacy transition phase: Existing vanilla JS prototype remains as reference until full modern stack is proven.
- Infrastructure: Docker Compose with MySQL, backend, frontend, and Nginx reverse proxy; CI/CD with GitHub Actions and GHCR image publishing.
