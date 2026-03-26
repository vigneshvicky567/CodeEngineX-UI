# RCE Backend MVP

A **production-oriented MVP backend** for a Remote Code Execution (RCE) system. Built with **FastAPI + Uvicorn**, **PostgreSQL**, and **Docker Compose**. Supports asynchronous judging via a background worker, with a pluggable runner interface backed by Judge0 CE by default.

---

## Architecture

```
┌──────────────┐     HTTP      ┌─────────────┐
│   Client     │ ──────────▶  │    FastAPI   │
└──────────────┘               │  (port 8000)│
                               └──────┬──────┘
                                      │ INSERT (status=queued)
                               ┌──────▼──────┐
                               │  PostgreSQL │
                               └──────┬──────┘
                                      │ SELECT FOR UPDATE SKIP LOCKED
                               ┌──────▼──────┐
                               │   Worker    │ ──▶ Judge0 / DockerRunner
                               └─────────────┘
```

- **API** — validates requests, inserts `submissions` row with `status=queued`, returns `submission_id`.
- **Worker** — polls DB every 2 s, claims jobs atomically, executes testcases via the configured Runner, writes results to `submission_test_results`, updates `submission.status`.
- **PostgreSQL** — single source of truth; no Redis or message broker required for MVP.

---

## Prerequisites

- [Docker Desktop](https://docs.docker.com/get-docker/) ≥ 24
- A [Judge0 CE](https://ce.judge0.com/) API key (RapidAPI) **or** a self-hosted Judge0 instance

---

## Quick Start

```bash
# 1. Clone
git clone <repo-url> rce-backend-mvp
cd rce-backend-mvp

# 2. Configure (copy and edit)
cp .env.example .env
# Edit .env — set JUDGE0_API_KEY (and optionally JUDGE0_URL for self-hosted)

# 3. Build & run all services
docker compose up --build
```

The API will be available at **http://localhost:8000**.
Interactive API docs: **http://localhost:8000/docs**

---

## Running Alembic Migrations

Migrations run **automatically** when the `api` container starts (`CMD` in `Dockerfile`).

To run them manually (e.g. for local dev without Docker):

```bash
pip install -r requirements.txt

# Set DATABASE_URL to your local Postgres
export DATABASE_URL=postgresql+psycopg2://rce:rce_password@localhost:5432/rce_db

alembic upgrade head
```

To create a new migration after changing models:

```bash
alembic revision --autogenerate -m "describe change"
alembic upgrade head
```

---

## Environment Variables

Copy `.env.example` to `.env` and customize. Key variables:

| Variable | Default | Description |
|---|---|---|
| `DATABASE_URL` | `postgresql+psycopg2://rce:rce_password@postgres:5432/rce_db` | SQLAlchemy DB URL |
| `RUNNER` | `judge0` | Runner backend: `judge0` or `docker` |
| `JUDGE0_URL` | `https://judge0-ce.p.rapidapi.com` | Judge0 base URL |
| `JUDGE0_API_KEY` | _(empty)_ | RapidAPI key for Judge0 CE |
| `DEFAULT_TIME_LIMIT_MS` | `1000` | Default CPU time limit |
| `DEFAULT_MEMORY_LIMIT_KB` | `262144` | Default memory limit (256 MB) |
| `WORKER_POLL_INTERVAL_S` | `2.0` | Worker polling interval |

---

## API Reference

### `POST /api/v1/run` — Quick synchronous run

```bash
curl -X POST http://localhost:8000/api/v1/run \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "language": "python",
    "source": "print(\"Hello, World!\")",
    "stdin": null,
    "persist": false
  }'
```

**Response:**
```json
{
  "status": "accepted",
  "stdout": "Hello, World!\n",
  "stderr": "",
  "time_ms": 42,
  "memory_kb": 8192,
  "submission_id": null
}
```

---

### `POST /api/v1/problems` — Create a problem (admin)

```bash
curl -X POST http://localhost:8000/api/v1/problems \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "hello-world",
    "title": "Hello World",
    "time_limit_ms": 1000,
    "memory_limit_kb": 262144,
    "judge_type": "normal",
    "testcases": [
      {
        "ordinal": 0,
        "input_text": "",
        "output_text": "Hello, World!",
        "is_hidden": false
      }
    ]
  }'
```

**Response:** `201 Created` with problem JSON including `id`.

---

### `POST /api/v1/submit` — Queue a submission

```bash
# Replace problem_id with one returned from POST /api/v1/problems
curl -X POST http://localhost:8000/api/v1/submit \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "problem_id": 1,
    "language": "python",
    "source": "print(\"Hello, World!\")",
    "run_type": "submit"
  }'
```

**Response:** `202 Accepted`
```json
{ "submission_id": 42 }
```

---

### `GET /api/v1/submissions/{id}` — Poll submission status

```bash
curl http://localhost:8000/api/v1/submissions/42
```

**Response:**
```json
{
  "id": 42,
  "user_id": 1,
  "problem_id": 1,
  "language": "python",
  "status": "accepted",
  "time_ms": 38,
  "memory_kb": 9216,
  "run_type": "submit",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:02Z",
  "test_results": [
    {
      "id": 1,
      "testcase_id": 1,
      "status": "accepted",
      "time_ms": 38,
      "memory_kb": 9216,
      "stdout": "Hello, World!\n"
    }
  ]
}
```

---

### `GET /api/v1/submissions` — List submissions (paginated)

```bash
curl "http://localhost:8000/api/v1/submissions?user_id=1&page=1&limit=10"
```

---

### `GET /api/v1/problems/{id}` — Get problem metadata

```bash
curl http://localhost:8000/api/v1/problems/1
```

---

## Running Tests

```bash
pip install -r requirements.txt httpx pytest

# Start the stack first
docker compose up -d

# Run tests (skips gracefully if API is unavailable)
pytest tests/ -v
```

---

## Project Structure

```
rce-backend-mvp/
├─ app/
│  ├─ main.py                   # FastAPI app + logging
│  ├─ api/v1/
│  │  ├─ submit.py              # POST /api/v1/submit
│  │  ├─ run.py                 # POST /api/v1/run
│  │  ├─ submissions.py         # GET /api/v1/submissions[/{id}]
│  │  ├─ problems.py            # GET/POST /api/v1/problems
│  │  └─ router.py              # Aggregates all routes
│  ├─ db/
│  │  ├─ base.py                # SQLAlchemy DeclarativeBase
│  │  ├─ models.py              # ORM models (5 tables)
│  │  └─ session.py             # Engine + SessionLocal
│  ├─ core/config.py            # Pydantic Settings (12-factor)
│  ├─ schemas/                  # Pydantic request/response models
│  ├─ services/
│  │  └─ submission_service.py  # Business logic
│  └─ runners/
│     ├─ base.py                # Abstract Runner interface
│     ├─ judge0_runner.py       # Judge0 REST API runner
│     └─ docker_runner.py       # Docker runner stub (TODO)
├─ worker/
│  └─ worker.py                 # Background poll worker
├─ alembic/
│  ├─ env.py
│  └─ versions/0001_create_tables.py
├─ tests/
│  └─ test_run.py               # Integration test stubs
├─ Dockerfile                   # API image
├─ Dockerfile.worker            # Worker image
├─ docker-compose.yml
├─ requirements.txt
└─ .env.example
```

---

## Runner Design

The `Runner` interface (`app/runners/base.py`) defines four lifecycle methods:

| Method | Called when |
|---|---|
| `prepare(submission)` | Once before compilation |
| `compile(submission)` | Once per submission (returns `None` on success) |
| `run_testcase(submission, testcase, time_ms, memory_kb)` | Once per testcase |
| `cleanup(submission)` | Always, in `finally` block |

### Judge0 Runner
- Uses Judge0 REST API (v2), base64-encoded I/O.
- Polls for result with 0.5 s intervals up to `JUDGE0_TIMEOUT_S + 5` seconds.
- Maps Judge0 status IDs → internal status strings (`accepted`, `tle`, `mle`, `runtime_error`, etc.).
- Supports 14+ languages via `LANGUAGE_MAP`.

### Docker Runner (stub)
- Located at `app/runners/docker_runner.py`.
- Contains detailed TODO comments showing exact Docker SDK calls, seccomp, `--cap-drop=ALL`, `--pids-limit`, and container pool design.
- Raises `NotImplementedError` — safe to import.

Switch runners via `.env`:
```
RUNNER=judge0   # default
RUNNER=docker   # use stub Docker runner (NotImplementedError until implemented)
```

---

## Worker Behavior

- **Claiming**: `SELECT ... FOR UPDATE SKIP LOCKED` ensures no two workers claim the same job.
- **Fail-fast**: Stops at the first failing testcase (wrong_answer, TLE, MLE, runtime_error).
- **time_ms**: Set to the **maximum** testcase time (worst-case latency), not the sum.
- **Output cap**: stdout truncated to `OUTPUT_LIMIT_BYTES` (default 10 MB).
- **Error recovery**: Unhandled exceptions mark the submission `runtime_error` via a separate DB session after rollback.

---

## Production Hardening TODOs

- [ ] Add JWT authentication and role-based access control
- [ ] Implement `DockerRunner` with proper sandbox isolation (seccomp, namespaces)
- [ ] Move source code storage to S3/GCS (replace `source_text` with `source_s3_key`)
- [ ] Add Celery + Redis or PGMQ for more robust job queuing at scale
- [ ] Multi-worker horizontal scaling (already works, `SKIP LOCKED` handles races)
- [ ] Add rate limiting per user (e.g. slowapi or a gateway layer)
- [ ] Add `special judge` support (custom checker binary)
- [ ] Parameterize seccomp profile per language
- [ ] Replace naive output comparison with normalized diff
- [ ] Add structured tracing (OpenTelemetry)
