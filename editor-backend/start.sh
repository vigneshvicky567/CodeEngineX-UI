#!/bin/sh
set -e

echo "Running database migrations..."
alembic upgrade head

echo "Starting server in background for seeding..."
uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000} &
SERVER_PID=$!

# Wait for server to be ready
echo "Waiting for server to be ready..."
sleep 5

echo "Seeding problems (if not exists)..."
python seed_problems.py || echo "Seeding skipped or failed (problems may already exist)"

# Stop background server
kill $SERVER_PID 2>/dev/null || true
sleep 1

echo "Starting server..."
exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
