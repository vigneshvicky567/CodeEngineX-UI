"""
Runner interface base class.

All concrete runners must inherit from this class and implement every method.
"""
from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from app.db.models import Submission, TestCase


@dataclass
class RunResult:
    """Structured result returned by run_testcase."""

    stdout: str
    stderr: str
    time_ms: Optional[int]
    memory_kb: Optional[int]
    exit_code: int
    status: str  # accepted | wrong_answer | tle | mle | runtime_error | compile_error


class Runner(ABC):
    """
    Abstract runner interface.

    Lifecycle (called by the worker for each submission):
      1. prepare()       – one-time setup (e.g. pull Docker image, create sandbox dir)
      2. compile()       – compile source if necessary; propagate compile errors
      3. run_testcase()  – execute once per testcase, return RunResult
      4. cleanup()       – tear down any resources created during prepare/compile
    """

    @abstractmethod
    def prepare(self, submission: "Submission") -> None:
        """
        Prepare any resources needed before compilation.
        For Judge0: no-op. For Docker: pull image, create working directory.
        """

    @abstractmethod
    def compile(self, submission: "Submission") -> Optional[RunResult]:
        """
        Compile the submission source.

        Returns None if compilation succeeded (or language is interpreted).
        Returns a RunResult with status='compile_error' if compilation failed.
        """

    @abstractmethod
    def run_testcase(
        self,
        submission: "Submission",
        testcase: "TestCase",
        time_limit_ms: int,
        memory_limit_kb: int,
    ) -> RunResult:
        """
        Execute the compiled/interpreted program against a single testcase.

        The runner is responsible for:
        - Feeding testcase.input_text as stdin.
        - Enforcing time_limit_ms and memory_limit_kb.
        - Returning stdout, stderr, exit_code, time_ms, memory_kb, and a
          status string (accepted|tle|mle|runtime_error).

        Note: correct/wrong determination is handled by the caller (worker).
        """

    @abstractmethod
    def cleanup(self, submission: "Submission") -> None:
        """
        Release any resources created during prepare() / compile().
        Must be idempotent (safe to call even if prepare() was never called).
        """
