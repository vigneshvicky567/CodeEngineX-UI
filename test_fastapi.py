import subprocess
import time
import requests

env = {
    "DATABASE_URL": "sqlite:///./test.db",
    "RUNNER": "docker", # stub runner
    "DEBUG": "true",
    "PYTHONPATH": ".",
}

subprocess.run(". venv/bin/activate && export DATABASE_URL=sqlite:///./test.db && alembic upgrade head", shell=True, cwd="editor-backend", env=env)

api_process = subprocess.Popen(". venv/bin/activate && export DATABASE_URL=sqlite:///./test.db && uvicorn app.main:app --port 8000", shell=True, cwd="editor-backend", env=env)

time.sleep(5)

try:
    response = requests.get("http://localhost:8000/api/v1/problems")
    print(f"API status code: {response.status_code}")
    print(f"API response: {response.json()}")
finally:
    api_process.terminate()
