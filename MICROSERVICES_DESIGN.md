# CodeQuest Microservice Architecture Design

This document outlines the blueprint for migrating the monolithic CodeQuest app to a microservices architecture, specifically focusing on the integration of the remote code execution environment (The Editor).

## 1. Service Boundaries

### 1.1 Core App Service (Backend)
- **Responsibility:** User authentication, progress tracking, path selection, goals, and generic lesson content.
- **Tech Stack:** Existing Node.js/TypeScript backend (if applicable) or new lightweight API service.
- **Database:** Primary PostgreSQL DB storing user state and profiles.

### 1.2 Code Execution Service (Editor Backend)
- **Responsibility:** Handling source code submissions, managing testcase execution, and returning real-time execution results.
- **Tech Stack:** FastAPI (Python), PostgreSQL (Execution specific data), Background Worker (polling/queuing).
- **Sub-components:**
  - **API Server:** Validates requests, queues submissions.
  - **Worker:** Polls DB, executes code using a pluggable runner (e.g., Judge0).
- **Database:** Isolated PostgreSQL DB storing only generic `problems` and isolated `submissions`.

### 1.3 Judge0 Service (Isolated Sandbox)
- **Responsibility:** Securely running arbitrary user code in isolated containers with strict memory and CPU limits.
- **Tech Stack:** Judge0 (Ruby on Rails/Go), Redis, PostgreSQL.

### 1.4 Frontend Gateway (Client)
- **Responsibility:** Aggregating data from both Core App API and Editor API to provide a seamless React Native user experience.

## 2. Communication Patterns

- **Client to Core Service:** Synchronous REST or GraphQL over HTTPS for fetching lessons and tracking progress.
- **Client to Editor Service:** Synchronous REST for quick `POST /run` endpoints, and async polling `GET /submissions/{id}` for larger queued evaluation tasks.
- **Core Service to Editor Service (Future):** Internal synchronous REST calls if the Core Service needs to programmatically fetch problem metadata or trigger automated evaluations.

## 3. Configuration Management Strategy

- **Environment Variables:** Each microservice maintains its own `.env` file managed via a secret manager (e.g., AWS Secrets Manager, HashiCorp Vault).
- **Docker Compose & Orchestration:**
  - Development: A unified `docker-compose.yml` (as implemented in the immediate integration) to spin up all services locally.
  - Production: Kubernetes or AWS ECS with separate task definitions for Core API, Editor API, Editor Worker, and Judge0 stack to scale them independently.
- **Service Discovery:** Frontend uses configurable Gateway URLs (e.g., `EXPO_PUBLIC_CORE_API_URL` and `EXPO_PUBLIC_EDITOR_API_URL`) to direct traffic to the respective services.

## 4. Current vs. Future State

- **Current (Monolithic Integration):** The Editor backend services have been added to the local `docker-compose.yml`, running alongside the Expo client. The frontend directly references the external API URL `http://localhost:8000`.
- **Future (Microservices):** Both backend APIs will be deployed independently. The frontend will hit an API Gateway, which will route traffic to either `/api/core/...` or `/api/editor/...`.
