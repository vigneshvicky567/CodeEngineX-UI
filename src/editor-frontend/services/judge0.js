/**
 * RCE API service — communicates with the rce-backend-mvp FastAPI server.
 *
 * Backend endpoints used:
 *   GET  /api/v1/problems          — list all problems (lightweight)
 *   GET  /api/v1/problems/{id}     — full problem detail (description, templates, testcases)
 *   POST /api/v1/run               — synchronous quick-execute (used for "Run")
 *   POST /api/v1/submit            — queue async submission  (used for "Submit")
 *   GET  /api/v1/submissions/{id}  — poll result after submit
 *
 * Run the backend with:
 *   cd rce-backend-mvp && docker compose up --build
 * The API is expected at http://localhost:8000.
 */

// Use environment variable or fallback to localhost for development
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

// ---------------------------------------------------------------------------
// Problem fetching
// ---------------------------------------------------------------------------

/**
 * Fetch the lightweight problem list: [{id, slug, title, difficulty}, ...]
 */
export const fetchProblems = async () => {
    const response = await fetch(`${BASE_URL}/api/v1/problems`);
    if (!response.ok) throw new Error(`Failed to load problems (${response.status})`);
    return response.json(); // array of ProblemListItem
};

/**
 * Fetch full problem data for one problem by its numeric id.
 * Returns {id, slug, title, difficulty, description, examples_json,
 *           constraints_json, code_templates_json, testcases, ...}
 */
export const fetchProblem = async (problemId) => {
    const response = await fetch(`${BASE_URL}/api/v1/problems/${problemId}`);
    if (!response.ok) throw new Error(`Failed to load problem ${problemId} (${response.status})`);
    return response.json(); // ProblemOut
};

// ---------------------------------------------------------------------------
// Map Judge0 numeric language IDs → backend language strings
// ---------------------------------------------------------------------------

// Map Judge0 numeric language IDs → backend language strings
const LANGUAGE_MAP = {
    71: 'python',
    50: 'c',
    54: 'cpp',
    62: 'java',
};

/**
 * Synchronous code execution — calls POST /api/v1/run.
 * Returns an object compatible with what CodeEditorScreen expects:
 *   { stdout, stderr, compile_output, status: { id, description }, time_ms, memory_kb }
 */
export const executeCode = async (code, languageId, stdin = '') => {
    const language = LANGUAGE_MAP[languageId] || 'python';

    let response;
    try {
        response = await fetch(`${BASE_URL}/api/v1/run`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: 1,
                language,
                source: code,
                stdin: stdin || null,
                persist: false,
            }),
        });
    } catch (networkErr) {
        throw new Error('Failed to connect to backend. Make sure the rce-backend-mvp server is running at http://localhost:8000.');
    }

    if (!response.ok) {
        let detail = `Backend error (${response.status})`;
        try {
            const body = await response.json();
            detail = body.detail || detail;
        } catch (_) { }
        throw new Error(detail);
    }

    const data = await response.json();

    // Normalize to shape CodeEditorScreen expects
    return {
        stdout: data.stdout || '',
        stderr: data.stderr || '',
        compile_output: data.status === 'compile_error' ? (data.stderr || 'Compilation failed') : null,
        status: {
            id: _statusToId(data.status),
            description: data.status,
        },
        time_ms: data.time_ms,
        memory_kb: data.memory_kb,
    };
};

/**
 * Async submission — calls POST /api/v1/submit then polls GET /api/v1/submissions/{id}.
 * Returns normalized result for BottomPanel's submissionResult state:
 *   { success, status, time_ms, memory_kb, message }
 *
 * @param {string} code
 * @param {number} languageId - Judge0 numeric language ID
 * @param {number} problemId  - backend problem ID (default 1 for Two Sum)
 */
export const submitSolution = async (code, languageId, problemId = 1) => {
    const language = LANGUAGE_MAP[languageId] || 'python';

    // 1. Queue the submission
    let submitResp;
    try {
        submitResp = await fetch(`${BASE_URL}/api/v1/submit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: 1,
                problem_id: problemId,
                language,
                source: code,
                run_type: 'submit',
            }),
        });
    } catch (networkErr) {
        throw new Error('Failed to connect to backend. Make sure the rce-backend-mvp server is running at http://localhost:8000.');
    }

    if (!submitResp.ok) {
        let detail = `Submission failed (${submitResp.status})`;
        try {
            const body = await submitResp.json();
            detail = body.detail || detail;
        } catch (_) { }
        throw new Error(detail);
    }

    const { submission_id } = await submitResp.json();

    // 2. Poll for result (every 2s, up to 30s)
    const POLL_INTERVAL_MS = 2000;
    const MAX_POLLS = 15;

    for (let i = 0; i < MAX_POLLS; i++) {
        await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL_MS));

        let pollResp;
        try {
            pollResp = await fetch(`${BASE_URL}/api/v1/submissions/${submission_id}`);
        } catch (networkErr) {
            throw new Error('Lost connection to backend while polling submission result.');
        }

        if (!pollResp.ok) {
            continue; // Retry on transient errors
        }

        const sub = await pollResp.json();
        const status = sub.status;

        // Still processing — keep polling
        if (status === 'queued' || status === 'processing') {
            continue;
        }

        // Done — normalize result
        const success = status === 'accepted';
        const topResult = sub.test_results && sub.test_results.length > 0 ? sub.test_results[0] : null;

        let message = '';
        if (success) {
            const total = sub.test_results ? sub.test_results.length : 0;
            message = `Your code passed all ${total} testcase${total !== 1 ? 's' : ''}.`;
        } else if (topResult) {
            message = `Failed on testcase ${topResult.testcase_id}: ${topResult.status}.`;
            if (topResult.stdout) {
                message += ` Output: ${topResult.stdout.slice(0, 120)}`;
            }
        }

        return {
            success,
            status: _formatStatus(status),
            time_ms: sub.time_ms ?? (topResult?.time_ms ?? 0),
            memory_kb: sub.memory_kb ?? (topResult?.memory_kb ?? 0),
            message,
        };
    }

    // Timed out polling
    return {
        success: false,
        status: 'Timeout',
        time_ms: 0,
        memory_kb: 0,
        message: 'Judging timed out. The server may be overloaded — try again.',
    };
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Convert backend status string to a rough Judge0-compatible numeric ID */
function _statusToId(status) {
    const map = {
        accepted: 3,
        wrong_answer: 4,
        tle: 5,
        mle: 6,
        runtime_error: 7,
        compile_error: 6,
        internal_error: 13,
    };
    return map[status] || 3;
}

/** Format snake_case backend status to Title Case for display */
function _formatStatus(status) {
    return status
        .replace(/_/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
}
