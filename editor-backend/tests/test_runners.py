"""
Unit tests for the Runner interface and implementations.

Judge0Runner: all HTTP calls are intercepted with respx (or unittest.mock).
DockerRunner: simply verify it raises NotImplementedError correctly.
RunResult: dataclass sanity checks.
"""
from __future__ import annotations

from unittest.mock import MagicMock, patch
import pytest

from app.runners.base import RunResult, Runner
from app.runners.docker_runner import DockerRunner
from app.runners.judge0_runner import Judge0Runner, _b64, _from_b64, _language_id, LANGUAGE_MAP


# ---------------------------------------------------------------------------
# RunResult dataclass
# ---------------------------------------------------------------------------

class TestRunResult:
    def test_create_run_result(self):
        r = RunResult(stdout="hi", stderr="", time_ms=10, memory_kb=512, exit_code=0, status="accepted")
        assert r.stdout == "hi"
        assert r.status == "accepted"

    def test_optional_fields_can_be_none(self):
        r = RunResult(stdout="", stderr="", time_ms=None, memory_kb=None, exit_code=0, status="tle")
        assert r.time_ms is None
        assert r.memory_kb is None


# ---------------------------------------------------------------------------
# Runner ABC
# ---------------------------------------------------------------------------

class TestRunnerABC:
    def test_cannot_instantiate_runner_directly(self):
        with pytest.raises(TypeError):
            Runner()  # type: ignore[abstract]

    def test_concrete_subclass_must_implement_all_methods(self):
        class IncompleteRunner(Runner):
            pass
        with pytest.raises(TypeError):
            IncompleteRunner()


# ---------------------------------------------------------------------------
# DockerRunner (stub)
# ---------------------------------------------------------------------------

class TestDockerRunner:
    @pytest.fixture
    def runner(self):
        return DockerRunner()

    def test_docker_runner_can_be_instantiated(self, runner: DockerRunner):
        assert isinstance(runner, DockerRunner)

    def test_prepare_raises_not_implemented(self, runner: DockerRunner):
        with pytest.raises(NotImplementedError):
            runner.prepare(MagicMock())

    def test_compile_raises_not_implemented(self, runner: DockerRunner):
        with pytest.raises(NotImplementedError):
            runner.compile(MagicMock())

    def test_run_testcase_raises_not_implemented(self, runner: DockerRunner):
        with pytest.raises(NotImplementedError):
            runner.run_testcase(MagicMock(), MagicMock(), 1000, 262144)

    def test_cleanup_raises_not_implemented(self, runner: DockerRunner):
        with pytest.raises(NotImplementedError):
            runner.cleanup(MagicMock())


# ---------------------------------------------------------------------------
# Judge0Runner helpers
# ---------------------------------------------------------------------------

class TestJudge0Helpers:
    def test_b64_encodes_string(self):
        import base64
        result = _b64("hello world")
        assert result == base64.b64encode(b"hello world").decode()

    def test_b64_returns_none_for_none(self):
        assert _b64(None) is None

    def test_from_b64_decodes(self):
        import base64
        encoded = base64.b64encode(b"decoded text").decode()
        assert _from_b64(encoded) == "decoded text"

    def test_from_b64_returns_empty_for_none(self):
        assert _from_b64(None) == ""

    def test_from_b64_returns_empty_for_empty(self):
        assert _from_b64("") == ""

    def test_language_id_python(self):
        assert _language_id("python") == 71
        assert _language_id("Python") == 71
        assert _language_id("python3") == 71

    def test_language_id_cpp(self):
        assert _language_id("cpp") == 54
        assert _language_id("c++") == 54

    def test_language_id_java(self):
        assert _language_id("java") == 62

    def test_language_id_go(self):
        assert _language_id("go") == 60

    def test_language_id_unknown_raises(self):
        with pytest.raises(ValueError, match="Unsupported language"):
            _language_id("cobol")

    def test_language_map_not_empty(self):
        assert len(LANGUAGE_MAP) >= 10


# ---------------------------------------------------------------------------
# Judge0Runner — mocked HTTP interactions
# ---------------------------------------------------------------------------

def _make_judge0_runner():
    return Judge0Runner()


def _make_submission(language: str = "python", source: str = "print(1)"):
    sub = MagicMock()
    sub.id = 1
    sub.language = language
    sub.source_text = source
    return sub


def _make_testcase(input_text: str = ""):
    tc = MagicMock()
    tc.id = 1
    tc.input_text = input_text
    tc.output_text = "1"
    return tc


class TestJudge0Runner:
    def test_prepare_is_noop(self):
        """prepare() must not raise."""
        runner = _make_judge0_runner()
        runner.prepare(_make_submission())  # no error

    def test_compile_returns_none(self):
        """compile() is a no-op for Judge0; must return None."""
        runner = _make_judge0_runner()
        result = runner.compile(_make_submission())
        assert result is None

    def test_cleanup_closes_client(self):
        runner = _make_judge0_runner()
        mock_client = MagicMock()
        mock_client.is_closed = False
        runner._client = mock_client
        runner.cleanup(_make_submission())
        mock_client.close.assert_called_once()
        assert runner._client is None

    def test_cleanup_idempotent_when_no_client(self):
        runner = _make_judge0_runner()
        runner._client = None
        runner.cleanup(_make_submission())  # must not raise

    def test_run_testcase_accepted(self):
        import base64
        runner = _make_judge0_runner()
        token = "test-token-123"

        post_response = MagicMock()
        post_response.raise_for_status.return_value = None
        post_response.json.return_value = {"token": token}

        result_data = {
            "status": {"id": 3},  # 3 = Accepted
            "stdout": base64.b64encode(b"1\n").decode(),
            "stderr": None,
            "compile_output": None,
            "time": "0.042",
            "memory": 4096,
            "exit_code": 0,
        }
        get_response = MagicMock()
        get_response.raise_for_status.return_value = None
        get_response.json.return_value = result_data

        mock_client = MagicMock()
        mock_client.post.return_value = post_response
        mock_client.get.return_value = get_response

        with patch.object(runner, "_get_client", return_value=mock_client):
            result = runner.run_testcase(_make_submission(), _make_testcase(), 1000, 262144)

        assert result.status == "accepted"
        assert result.stdout == "1\n"
        assert result.time_ms == 42
        assert result.memory_kb == 4096

    def test_run_testcase_tle(self):
        runner = _make_judge0_runner()

        post_response = MagicMock()
        post_response.raise_for_status.return_value = None
        post_response.json.return_value = {"token": "tok"}

        get_response = MagicMock()
        get_response.raise_for_status.return_value = None
        get_response.json.return_value = {
            "status": {"id": 5},  # 5 = TLE
            "stdout": None, "stderr": None, "compile_output": None,
            "time": "1.001", "memory": 4096, "exit_code": 1,
        }

        mock_client = MagicMock()
        mock_client.post.return_value = post_response
        mock_client.get.return_value = get_response

        with patch.object(runner, "_get_client", return_value=mock_client):
            result = runner.run_testcase(_make_submission(), _make_testcase(), 1000, 262144)

        assert result.status == "tle"

    def test_run_testcase_compile_error(self):
        import base64
        runner = _make_judge0_runner()

        post_response = MagicMock()
        post_response.raise_for_status.return_value = None
        post_response.json.return_value = {"token": "tok"}

        get_response = MagicMock()
        get_response.raise_for_status.return_value = None
        get_response.json.return_value = {
            "status": {"id": 6},  # 6 = Compile Error
            "stdout": None,
            "stderr": None,
            "compile_output": base64.b64encode(b"SyntaxError").decode(),
            "time": None, "memory": None, "exit_code": 1,
        }

        mock_client = MagicMock()
        mock_client.post.return_value = post_response
        mock_client.get.return_value = get_response

        with patch.object(runner, "_get_client", return_value=mock_client):
            result = runner.run_testcase(_make_submission(), _make_testcase(), 1000, 262144)

        assert result.status == "compile_error"
        assert "SyntaxError" in result.stderr

    def test_run_testcase_http_error_returns_system_error(self):
        import httpx
        runner = _make_judge0_runner()

        mock_client = MagicMock()
        mock_client.post.side_effect = httpx.HTTPStatusError(
            "500", request=MagicMock(), response=MagicMock(text="Internal Server Error")
        )

        with patch.object(runner, "_get_client", return_value=mock_client):
            result = runner.run_testcase(_make_submission(), _make_testcase(), 1000, 262144)

        assert result.status == "system_error"

    def test_run_testcase_connection_error_returns_system_error(self):
        import httpx
        runner = _make_judge0_runner()

        mock_client = MagicMock()
        mock_client.post.side_effect = httpx.ConnectError("refused")

        with patch.object(runner, "_get_client", return_value=mock_client):
            result = runner.run_testcase(_make_submission(), _make_testcase(), 1000, 262144)

        assert result.status == "system_error"

    def test_run_testcase_no_token_returns_system_error(self):
        runner = _make_judge0_runner()
        post_response = MagicMock()
        post_response.raise_for_status.return_value = None
        post_response.json.return_value = {}  # no token

        mock_client = MagicMock()
        mock_client.post.return_value = post_response

        with patch.object(runner, "_get_client", return_value=mock_client):
            result = runner.run_testcase(_make_submission(), _make_testcase(), 1000, 262144)

        assert result.status == "system_error"

    def test_run_testcase_stdout_truncated(self):
        """Stdout exceeding OUTPUT_LIMIT_BYTES must be truncated."""
        import base64
        from app.core.config import settings

        runner = _make_judge0_runner()
        big_output = "A" * (settings.OUTPUT_LIMIT_BYTES + 1000)
        encoded = base64.b64encode(big_output.encode()).decode()

        post_response = MagicMock()
        post_response.raise_for_status.return_value = None
        post_response.json.return_value = {"token": "tok"}

        get_response = MagicMock()
        get_response.raise_for_status.return_value = None
        get_response.json.return_value = {
            "status": {"id": 3}, "stdout": encoded,
            "stderr": None, "compile_output": None,
            "time": "0.1", "memory": 4096, "exit_code": 0,
        }

        mock_client = MagicMock()
        mock_client.post.return_value = post_response
        mock_client.get.return_value = get_response

        with patch.object(runner, "_get_client", return_value=mock_client):
            result = runner.run_testcase(_make_submission(), _make_testcase(), 1000, 262144)

        assert len(result.stdout) <= settings.OUTPUT_LIMIT_BYTES

    def test_polling_waits_on_processing_status(self):
        """Simulates status=2 (Processing) followed by status=3 (Accepted)."""
        import base64
        runner = _make_judge0_runner()

        post_response = MagicMock()
        post_response.raise_for_status.return_value = None
        post_response.json.return_value = {"token": "tok"}

        call_count = {"n": 0}

        def mock_get(*args, **kwargs):
            call_count["n"] += 1
            resp = MagicMock()
            resp.raise_for_status.return_value = None
            if call_count["n"] < 3:
                resp.json.return_value = {"status": {"id": 2}}  # Processing
            else:
                resp.json.return_value = {
                    "status": {"id": 3},
                    "stdout": base64.b64encode(b"done").decode(),
                    "stderr": None, "compile_output": None,
                    "time": "0.1", "memory": 4096, "exit_code": 0,
                }
            return resp

        mock_client = MagicMock()
        mock_client.post.return_value = post_response
        mock_client.get.side_effect = mock_get

        with patch("time.sleep"):  # don't actually wait
            with patch.object(runner, "_get_client", return_value=mock_client):
                result = runner.run_testcase(_make_submission(), _make_testcase(), 1000, 262144)

        assert result.status == "accepted"
        assert call_count["n"] >= 3  # polled at least 3 times
