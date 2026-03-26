"""
Docker Runner — STUB implementation.

This file is intentionally incomplete. It shows the intended architecture
for running user code inside isolated Docker containers without relying on
an external service like Judge0.

TODO (production hardening — in rough priority order):
  1. Install docker SDK: `pip install docker`
  2. Pull/verify image availability in prepare().
  3. Implement compile() for compiled languages (C, C++, Java, Rust).
     - Write source to a temp dir mounted into a compiler container.
     - Run compiler, capture stderr, check exit code.
  4. In run_testcase():
     - Create a Docker container with:
         docker.from_env().containers.run(
             image="python:3.11-slim",         # per-language image
             command=["python", "solution.py"],
             mem_limit=f"{memory_limit_kb}k",
             memswap_limit=f"{memory_limit_kb}k",  # disable swap
             pids_limit=64,
             network_disabled=True,
             read_only=True,
             detach=True,
             stdin_open=True,
             volumes={tmp_dir: {"bind": "/sandbox", "mode": "ro"}},
             security_opt=["no-new-privileges:true"],
             # TODO: add seccomp profile:
             #   security_opt=["seccomp=/path/to/seccomp_profile.json"],
             cap_drop=["ALL"],
             user="nobody",
         )
     - Feed stdin via container.attach_socket() or docker exec.
     - Use container.wait(timeout=…) to enforce CPU time limit.
     - Read stdout/stderr from container logs.
  5. In cleanup():
     - container.remove(force=True) to avoid leaked containers.
     - shutil.rmtree(tmp_dir) to clean up source files.
  6. Harden with Linux namespaces / cgroupv2 directly for sub-millisecond
     overhead (optional, for performance-critical prod use).
  7. Maintain a container pool (warm containers) to reduce cold-start latency.
"""
from __future__ import annotations

from typing import Optional, TYPE_CHECKING

from app.runners.base import Runner, RunResult

if TYPE_CHECKING:
    from app.db.models import Submission, TestCase


class DockerRunner(Runner):
    """
    Stub Docker runner — raises NotImplementedError on all execution paths.

    Import and instantiate this class safely; only method calls raise.
    """

    def prepare(self, submission: "Submission") -> None:
        # TODO: pull Docker image for submission.language
        raise NotImplementedError("DockerRunner.prepare() is not yet implemented. See TODOs above.")

    def compile(self, submission: "Submission") -> Optional[RunResult]:
        # TODO: write source to /tmp/<submission_id>/, compile inside container
        raise NotImplementedError("DockerRunner.compile() is not yet implemented.")

    def run_testcase(
        self,
        submission: "Submission",
        testcase: "TestCase",
        time_limit_ms: int,
        memory_limit_kb: int,
    ) -> RunResult:
        # TODO: spawn isolated Docker container, pipe stdin, collect stdout/stderr
        raise NotImplementedError("DockerRunner.run_testcase() is not yet implemented.")

    def cleanup(self, submission: "Submission") -> None:
        # TODO: remove container and temp directory
        raise NotImplementedError("DockerRunner.cleanup() is not yet implemented.")
