# RCE Backend MVP — Complete Guide

> A backend that lets you **run code and judge it against testcases**, like LeetCode or HackerRank — built with FastAPI, PostgreSQL, and a self-hosted Judge0 sandbox.

---

## Table of Contents

- [RCE Backend MVP — Complete Guide](#rce-backend-mvp--complete-guide)
  - [Table of Contents](#table-of-contents)
  - [1. What Is This?](#1-what-is-this)
  - [2. How It Works — Big Picture](#2-how-it-works--big-picture)
  - [3. What's Running (7 Services)](#3-whats-running-7-services)
  - [4. Setup From Scratch](#4-setup-from-scratch)
    - [Prerequisites](#prerequisites)
    - [Steps](#steps)
    - [Verify it's working](#verify-its-working)
    - [To stop everything](#to-stop-everything)
  - [5. API Reference](#5-api-reference)
    - [`GET /health`](#get-health)
    - [`POST /api/v1/run`](#post-apiv1run)
    - [`POST /api/v1/problems`](#post-apiv1problems)
    - [`GET /api/v1/problems/{id}`](#get-apiv1problemsid)
    - [`POST /api/v1/submit`](#post-apiv1submit)
    - [`GET /api/v1/submissions/{id}`](#get-apiv1submissionsid)
    - [`GET /api/v1/submissions?page=1&limit=10`](#get-apiv1submissionspage1limit10)
    - [Interactive Docs](#interactive-docs)
  - [6. Full Workflow Example](#6-full-workflow-example)
  - [7. Status Reference](#7-status-reference)
  - [8. Supported Languages](#8-supported-languages)
  - [9. Key Files](#9-key-files)
  - [10. Bugs Fixed](#10-bugs-fixed)
    - [Test Suite (pytest)](#test-suite-pytest)
    - [Docker / Runtime](#docker--runtime)

---

## 1. What Is This?

This is the **backend** for an online code editor. When a user writes code and clicks "Run" or "Submit":

- The backend **sends the code to a sandboxed executor** (Judge0)
- Judge0 **compiles and runs it safely** inside an isolated Linux container
- The backend **compares the output** against hidden testcases
- The result (`accepted`, `wrong_answer`, etc.) is **returned to the client**

It is **not** a frontend. It exposes a REST API that any frontend (React, VS Code extension, etc.) can call.

---

## 2. How It Works — Big Picture

```
Your Code
   │
   ▼
POST /api/v1/run          ← Quick run (no testcases, instant result)
   or
POST /api/v1/submit       ← Full submission (judged against testcases)
   │
   ▼
FastAPI (port 8000)
   │  saves submission to DB with status = "queued"
   ▼
PostgreSQL
   │  worker polls every 2 seconds
   ▼
RCE Worker
   │  sends code to Judge0
   ▼
Judge0 CE (port 2358)     ← Self-hosted sandbox on your machine
   │  compiles + runs code inside a secure Linux box
   │  enforces CPU time, memory, file size limits
   ▼
Result saved back to DB
   │
   ▼
GET /api/v1/submissions/{id}   ← Poll this to get the verdict
```

**Key design choice:** The API returns immediately with a `submission_id`. The judging happens asynchronously in the background. You poll for the result.

---

## 3. What's Running (7 Services)

| Container | What It Does | Port |
|---|---|---|
| `api` | FastAPI REST API — the main entry point | 8000 |
| `worker` | Background Python process — picks up queued submissions and runs them | — |
| `postgres` | Database for the RCE backend (problems, submissions, results) | 5432 |
| `judge0` | Judge0 CE API server — receives code, queues it for execution | 2358 |
| `judge0-worker` | Judge0's internal worker — actually compiles and runs the code in a sandbox | — |
| `judge0-db` | PostgreSQL for Judge0's internal use | — |
| `judge0-redis` | Redis message queue between `judge0` and `judge0-worker` | — |

---

## 4. Setup From Scratch

### Prerequisites

- **Docker Desktop** running (Windows: ensure WSL2 backend is enabled)
- **~4 GB disk** for the Judge0 image

### Steps

```powershell
# 1. Clone the repo
cd "c:\Users\thava\internship hex\Editor\rce-backend-mvp"

# 2. Start persistence layers first (prevents race conditions)
docker compose up -d postgres judge0-db judge0-redis

# 3. Wait 12 seconds for databases to initialise
Start-Sleep -Seconds 12

# 4. Start Judge0 server + worker
docker compose up -d judge0 judge0-worker

# 5. Wait 15 seconds for Judge0 to boot
Start-Sleep -Seconds 15

# 6. Start the RCE API + worker
docker compose up -d api worker

# 7. Verify everything is up
docker compose ps
```

> **Why the phased startup?**
> PostgreSQL and Redis need time to initialise. If Judge0 starts before its database is ready, it crashes. The 3-phase approach eliminates this race condition.

### Verify it's working

```powershell
# Health check
Invoke-RestMethod http://localhost:8000/health

# Judge0 version check
Invoke-RestMethod http://localhost:2358/about
```

Expected output:
```json
{"status": "ok", "version": "0.1.0"}
{"version": "1.13.1", ...}
```

### To stop everything

```powershell
docker compose down        # stop (keeps data)
docker compose down -v     # stop + wipe all data
```

---

## 5. API Reference

### `GET /health`
Check if the API is alive.

```powershell
Invoke-RestMethod http://localhost:8000/health
# → {"status": "ok", "version": "0.1.0"}
```

---

### `POST /api/v1/run`
**Quick-run** code without a problem or testcases. Returns result immediately.

| Field | Type | Description |
|---|---|---|
| `user_id` | int | Any positive integer |
| `language` | string | e.g. `"python"`, `"javascript"`, `"java"` |
| `source` | string | The code to run |
| `stdin` | string? | Optional input piped to the program |
| `persist` | bool | Save as a submission row (default `false`) |

```powershell
$body = @{
    user_id  = 1
    language = "python"
    source   = "print('Hello World!')"
    stdin    = $null
    persist  = $false
} | ConvertTo-Json

Invoke-RestMethod -Method POST http://localhost:8000/api/v1/run `
    -ContentType "application/json" -Body $body
```

Response:
```json
{
  "status": "accepted",
  "stdout": "Hello World!\n",
  "stderr": "",
  "time_ms": 70,
  "memory_kb": 7032,
  "submission_id": null
}
```

---

### `POST /api/v1/problems`
Create a problem with testcases.

| Field | Type | Description |
|---|---|---|
| `slug` | string | Unique identifier, e.g. `"two-sum"` |
| `title` | string | Display name |
| `time_limit_ms` | int | Max execution time per testcase (default 1000) |
| `memory_limit_kb` | int | Max memory per testcase (default 262144 = 256 MB) |
| `testcases` | array | List of `{ordinal, input_text, output_text, is_hidden}` |

```powershell
$problem = @{
    slug          = "add-two-numbers"
    title         = "Add Two Numbers"
    time_limit_ms = 2000
    testcases     = @(
        @{ ordinal = 0; input_text = "3 5";   output_text = "8";  is_hidden = $false },
        @{ ordinal = 1; input_text = "10 20"; output_text = "30"; is_hidden = $false },
        @{ ordinal = 2; input_text = "-1 1";  output_text = "0";  is_hidden = $true  }
    )
} | ConvertTo-Json -Depth 5

Invoke-RestMethod -Method POST http://localhost:8000/api/v1/problems `
    -ContentType "application/json" -Body $problem
```

Response includes a `problem_id` you'll use when submitting.

---

### `GET /api/v1/problems/{id}`
Retrieve a problem and its testcase list (input/output text is hidden from the response).

```powershell
Invoke-RestMethod http://localhost:8000/api/v1/problems/1
```

---

### `POST /api/v1/submit`
Submit code to be judged against all testcases of a problem.

| Field | Type | Description |
|---|---|---|
| `user_id` | int | Any positive integer |
| `problem_id` | int | ID of the problem |
| `language` | string | e.g. `"python"` |
| `source` | string | The code to judge |

```powershell
$sub = @{
    user_id    = 1
    problem_id = 1
    language   = "python"
    source     = "a, b = map(int, input().split())`nprint(a + b)"
} | ConvertTo-Json

$result = Invoke-RestMethod -Method POST http://localhost:8000/api/v1/submit `
    -ContentType "application/json" -Body $sub

Write-Host "Submission ID: $($result.submission_id)"
```

Returns immediately with `{"submission_id": 2}`. The judging happens in the background.

---

### `GET /api/v1/submissions/{id}`
Poll for the result of a submission.

```powershell
Invoke-RestMethod http://localhost:8000/api/v1/submissions/2
```

Response:
```json
{
  "id": 2,
  "status": "accepted",
  "time_ms": 56,
  "memory_kb": null,
  "test_results": [
    { "testcase_id": 1, "status": "accepted", "stdout": "8\n",  "time_ms": 56 },
    { "testcase_id": 2, "status": "accepted", "stdout": "30\n", "time_ms": 42 },
    { "testcase_id": 3, "status": "accepted", "stdout": "0\n",  "time_ms": 43 }
  ]
}
```

Keep polling until `status` is no longer `"queued"` or `"running"`.

---

### `GET /api/v1/submissions?page=1&limit=10`
List all submissions (paginated).

```powershell
Invoke-RestMethod "http://localhost:8000/api/v1/submissions?page=1&limit=10"
```

---

### Interactive Docs

Open **http://localhost:8000/docs** in your browser for the full Swagger UI where you can try every endpoint interactively.

---

## 6. Full Workflow Example

Here's the complete flow in PowerShell — create a problem, submit a solution, get the verdict:

```powershell
# Step 1 — Create a problem with 3 testcases
$p = Invoke-RestMethod -Method POST http://localhost:8000/api/v1/problems `
    -ContentType "application/json" -Body (@{
        slug      = "my-problem"
        title     = "Square a Number"
        testcases = @(
            @{ ordinal = 0; input_text = "4"; output_text = "16"; is_hidden = $false },
            @{ ordinal = 1; input_text = "5"; output_text = "25"; is_hidden = $true  }
        )
    } | ConvertTo-Json -Depth 5)

Write-Host "Problem ID: $($p.id)"

# Step 2 — Submit a solution
$r = Invoke-RestMethod -Method POST http://localhost:8000/api/v1/submit `
    -ContentType "application/json" -Body (@{
        user_id    = 1
        problem_id = $p.id
        language   = "python"
        source     = "n = int(input())`nprint(n * n)"
    } | ConvertTo-Json)

# Step 3 — Poll until done
$id = $r.submission_id
do {
    Start-Sleep -Seconds 2
    $verdict = Invoke-RestMethod "http://localhost:8000/api/v1/submissions/$id"
    Write-Host "Status: $($verdict.status)"
} while ($verdict.status -in @("queued", "running"))

# Step 4 — Show result
$verdict | ConvertTo-Json -Depth 5
```

---

## 7. Status Reference

| Status | Meaning |
|---|---|
| `queued` | Waiting to be picked up by the worker |
| `running` | Currently being judged |
| `accepted` | All testcases passed ✅ |
| `wrong_answer` | Output didn't match expected |
| `tle` | Exceeded time limit |
| `mle` | Exceeded memory limit |
| `runtime_error` | Program crashed (segfault, exception, etc.) |
| `compile_error` | Code failed to compile |
| `system_error` | Internal error (sandbox issue, Judge0 down) |

---

## 8. Supported Languages

| Language | Use in API |
|---|---|
| Python 3 | `"python"` |
| JavaScript (Node.js) | `"javascript"` |
| TypeScript | `"typescript"` |
| Java | `"java"` |
| C | `"c"` |
| C++ | `"cpp"` |
| Go | `"go"` |
| Rust | `"rust"` |
| Ruby | `"ruby"` |
| Bash | `"bash"` |
| C# | `"csharp"` |
| PHP | `"php"` |
| Kotlin | `"kotlin"` |
| Swift | `"swift"` |

---

## 9. Key Files

```
rce-backend-mvp/
│
├── docker-compose.yml          # All 7 services defined here
├── .env                        # Environment variables (DB passwords, ports, etc.)
│
├── app/
│   ├── main.py                 # FastAPI app entry point
│   ├── api/v1/
│   │   ├── run.py              # POST /run endpoint
│   │   ├── submit.py           # POST /submit endpoint
│   │   ├── problems.py         # Problem CRUD
│   │   └── submissions.py      # Submission polling
│   ├── runners/
│   │   └── judge0_runner.py    # Talks to Judge0 API, handles polling
│   └── core/config.py          # All settings loaded from .env
│
├── worker/
│   └── worker.py               # Background job: polls DB, runs testcases, saves results
│
└── alembic/versions/
    └── 0001_create_tables.py   # Database schema migration
```

---

## 10. Bugs Fixed

This is a record of every bug that was discovered and fixed getting this system running.

### Test Suite (pytest)

| # | File | Bug | Fix |
|---|---|---|---|
| 1 | `tests/conftest.py` | SQLite sessions weren't cleaned between tests — rows from one test leaked into the next, causing UNIQUE constraint failures | Replaced the broken savepoint-rollback approach with table-truncation (`DELETE` all rows before each test) |
| 2 | `tests/test_run.py` | `test_health_check` crashed with `ConnectError` when no live server was running | Added `pytest.skip()` when server is unreachable |
| 3 | `worker/worker.py` | When a submission had a compile error, the `sub.status` was never saved to the database — it returned early before writing | Moved `sub.status = final_status` before the early `return` |

### Docker / Runtime

| # | File | Bug | Fix |
|---|---|---|---|
| 4 | `app/core/config.py` | Pydantic rejected `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` from `.env` as "extra fields" | Added `extra="ignore"` to `SettingsConfigDict` |
| 5 | `alembic/versions/0001_create_tables.py` | Migration failed on restart: `DuplicateObject: type "judge_type_enum" already exists` | Used a PostgreSQL `DO $$ IF NOT EXISTS $$` block + `postgresql.ENUM(create_type=False)` |
| 6 | `docker-compose.yml` | Used `REDIS_URL` but Judge0 reads `REDIS_HOST` + `REDIS_PORT` separately | Split into correct separate variables |
| 7 | `docker-compose.yml` | `REDIS_PASSWORD: ""` caused Judge0 to send `AUTH ""` to Redis, which rejected it | Removed the `REDIS_PASSWORD` key entirely |
| 8 | `app/runners/judge0_runner.py` | `max_file_size` was set to 10240 KB but Judge0 caps it at 4096 KB | Added `min(..., 4096)` cap |
| 9 | `docker-compose.yml` | Judge0's `isolate` sandbox couldn't write to `/sys/fs/cgroup` (read-only in WSL2 Docker) — code execution always failed with `system_error` | Added `cgroup: host` and mounted `/sys/fs/cgroup:/sys/fs/cgroup:rw` |

---

*Stack: FastAPI · PostgreSQL · SQLAlchemy · Alembic · Judge0 CE v1.13.1 · Docker Compose · Python 3.11*
