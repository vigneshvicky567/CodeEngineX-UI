# CodeEngineX-UI — Full Integration TODO
> **Date:** 2026-03-26
> **Status:** UI-complete, backend-empty. This document is the single source of truth for wiring the frontend to all backend pods.

---

## Overview

The app (**CodeQuest**) is a Duolingo-style mobile coding education platform. All 12 screens are visually complete with NativeWind/React Native. Zero real data flows anywhere — every endpoint is a `// BACKEND:` stub.

The backend is split across 4 pods. This TODO maps every screen → every API → every pod, and lists exactly what the UI layer needs to build to connect them.

```
FRONTEND (this repo)
    ↕ HTTP/JWT
BACKEND PODS
    Pod 1  — Auth + Assessments (FastAPI · PostgreSQL)
    Pod 2a — The Editor / RCE  (FastAPI · Judge0 · Redis)
    Pod 2b — Quiz Auto-Eval    (FastAPI · PostgreSQL · Redis)
    Pod 3  — AI Tutor + Chatbot + Quiz Gen (FastAPI · OpenAI)
    Pod 4  — Certificates + Streaks + Auth infra (FastAPI · Redis · ReportLab)
```

---

## Part 1 — Infrastructure (Do This First)

These are cross-cutting concerns that every screen depends on. Nothing else works until these exist.

### 1.1 API Client (`lib/api.ts`)
- Create an Axios (or fetch) wrapper with:
  - `BASE_URL` from env (`EXPO_PUBLIC_API_URL`)
  - Auto-attach `Authorization: Bearer <token>` header from stored token
  - Global error interceptor → 401 clears session, shows login
  - Typed request/response helpers: `get<T>`, `post<T>`, `put<T>`, `del<T>`

### 1.2 Auth Token Storage (`lib/auth.ts`)
- Use `expo-secure-store` to persist `access_token` + `refresh_token`
- Functions: `saveTokens()`, `getAccessToken()`, `clearTokens()`
- On app boot (`App.tsx`): read token → if valid → skip to `MainTabs`, else → `Auth`

### 1.3 State Management (`store/`)
- Add Zustand (lightweight, no boilerplate)
- Stores needed:
  - `authStore` — user object, tokens, isLoggedIn
  - `progressStore` — map nodes, streak, gems
  - `lessonStore` — current lesson, quiz state
  - `editorStore` — current code, language, output

### 1.4 Environment Config (`.env`)
```
EXPO_PUBLIC_API_URL=http://localhost:8000
EXPO_PUBLIC_GOOGLE_CLIENT_ID=<from Pod 4 OAuth setup>
```

---

## Part 2 — Pod 4: Authentication & Authorization

**Owner:** Agness Precella T
**Connects to:** Screen4 (Auth), Screen1–3 (Onboarding), App.tsx boot logic

### Endpoints to wire

| Method | Endpoint | Screen | Current stub |
|--------|----------|--------|--------------|
| POST | `/api/v1/auth/signup` | Screen4 → Register | `// BACKEND: POST /api/auth/register` |
| POST | `/api/v1/auth/login` | Screen4 → Login | `// BACKEND: POST /api/auth/login` |
| POST | `/api/v1/auth/google` | Screen4 → Google button | OAuth stub (UI only) |

### What needs to change in the UI

**Screen4 (Auth)**
- [ ] Wire "Log In" button → `POST /api/v1/auth/login` → save tokens → navigate to `MainTabs`
- [ ] Wire "Sign Up" flow → `POST /api/v1/auth/signup` → save tokens → navigate to `PathSelection`
- [ ] Wire Google button → initiate OAuth flow via `expo-auth-session` → `POST /api/v1/auth/google`
- [ ] Show error toasts on 401/400 responses
- [ ] Loading spinner while request is in-flight

**App.tsx boot**
- [ ] On mount: check stored token → validate → route to correct screen

**Onboarding (Screen1–3)**
- [ ] Gate these screens behind auth check
- [ ] Screen1 → `POST /api/user/path` (save path selection)
- [ ] Screen2 → `POST /api/user/experience` (save experience level)
- [ ] Screen3 → `POST /api/user/goal` (save daily goal)
- [ ] After Screen3 → navigate to `MainTabs`

---

## Part 3 — Pod 1: Assessments

**Owner:** Vishvaa K
**Connects to:** Screen8 (LessonQuiz), Screen5 (LessonIntro)

The Pod 1 assessment system (Grammar/Reading/Listening) maps to the quiz flow in the app. Each quiz in the app is an *attempt* on an *assessment*.

### Endpoint mapping

| Method | Endpoint | Screen | Current stub |
|--------|----------|--------|--------------|
| GET | `/api/v1/grammar/assessments` | Screen7 (Explore) | `// BACKEND: GET /api/courses` |
| GET | `/api/v1/grammar/assessments/{id}` | Screen5 (LessonIntro) | `// BACKEND: GET /api/lessons/{lessonId}` |
| POST | `/api/v1/grammar/assessments/{id}/attempts` | Screen8 (Quiz start) | `// BACKEND: GET /api/quizzes/{quizId}` |
| POST | `/api/v1/.../attempts/{aid}/answers` | Screen8 (answer submit) | `// BACKEND: POST /api/quizzes/{quizId}/submit` |
| POST | `/api/v1/.../attempts/{aid}/submit` | Screen8 (finish quiz) | part of submit flow |
| GET | `/api/v1/.../attempts/{aid}/results` | Screen10 (LessonComplete) | part of completion flow |

### What needs to change in the UI

**Screen8 (LessonQuiz)**
- [ ] On mount: call `POST /attempts` to create attempt, receive `attempt_id`
- [ ] Store `attempt_id` in `lessonStore`
- [ ] When user selects option and taps "Check": call `POST /answers` with `{question_id, selected_option_id}`
- [ ] On response: show correct/incorrect feedback (already has UI for this)
- [ ] On "Continue": advance to next question or navigate to Screen10
- [ ] Replace hardcoded `options` array with API response data

**Screen5 (LessonIntro)**
- [ ] On mount: call `GET /assessments/{id}` to fetch lesson title, description, instructions
- [ ] Replace static text with API data
- [ ] Pass `assessment_id` via navigation params from Screen6/Screen7

**Screen10 (LessonComplete)**
- [ ] On mount: call `GET /attempts/{aid}/results` to fetch score, XP earned
- [ ] Display real score instead of hardcoded values
- [ ] Call `POST /api/lessons/{lessonId}/complete` to finalize + unlock next node

---

## Part 4 — Pod 2a: The Editor (RCE / Code Execution)

**Owner:** Pod 2a team
**Connects to:** Screen12 (MobileIDE)

The Monaco editor is already built. It just needs to call the Judge0-backed execution API.

### Endpoint mapping

| Method | Endpoint | Screen | Current stub |
|--------|----------|--------|--------------|
| GET | `/api/v1/problems` | Screen7 (Explore) | `// BACKEND: GET /api/courses` |
| GET | `/api/v1/problems/{id}` | Screen12 (IDE) | none — needs adding |
| POST | `/api/v1/run` | Screen12 (play button) | `// BACKEND: POST /api/code/execute` |
| POST | `/api/v1/submit` | Screen12 (submit) | part of execute flow |
| GET | `/api/v1/submissions/{id}` | Screen12 (polling) | part of execute flow |

### What needs to change in the UI

**Screen12 (MobileIDE)**
- [ ] Wire play button → `POST /api/v1/run` with `{source_code, language}`
- [ ] Display returned `stdout` / `stderr` in the console drawer (UI already exists)
- [ ] For submit: `POST /api/v1/submit` → poll `GET /api/v1/submissions/{id}` every 1s until terminal status
- [ ] Show verdict badge: ACCEPTED / WRONG ANSWER / TLE / RUNTIME ERROR / COMPILE ERROR
- [ ] Replace hardcoded language list with supported languages from API
- [ ] Pass `problem_id` from navigation params (set when user starts a lesson from Screen6/Screen7)

---

## Part 5 — Pod 2b: Quiz Auto-Evaluation

**Owner:** Pod 2b team
**Connects to:** Screen8 (LessonQuiz) — alternate quiz source (Hexaware-style week/day structure)

This pod is an alternative/supplementary quiz engine to Pod 1. It serves course-structured quizzes (Week 1 / Day 1).

### Endpoint mapping

| Method | Endpoint | Screen |
|--------|----------|--------|
| GET | `/courses/{id}/structure` | Screen7 (Explore) — course week/day tree |
| GET | `/quiz/{id}/overview` | Screen5 (LessonIntro) — pre-quiz modal |
| POST | `/quiz/start` | Screen8 — start session |
| GET | `/quiz/question/{sid}` | Screen8 — fetch next question |
| POST | `/quiz/answer` | Screen8 — submit answer |
| POST | `/quiz/submit` | Screen8 — end session |
| GET | `/quiz/result/{sid}` | Screen10 — score report |
| GET | `/quiz/report/{sid}/pdf` | Screen11 or new screen — download certificate/report |

### What needs to change in the UI

**Screen7 (Explore)**
- [ ] Add course week/day tree view (collapsible) when a course is selected
- [ ] Each day node navigates to Screen5 (LessonIntro) with `quiz_id`

**Screen8 — Pod 2b path**
- [ ] Adaptive question flow: fetch next question after each answer
- [ ] Show bookmark button functionality (already visible in UI, needs `PATCH /quiz/bookmark`)
- [ ] Show Q navigator grid (1–10) — already exists in mockup, needs real question count

---

## Part 6 — Pod 3: AI Features

**Owner:** Pooja S (AI Tutor) · Ajay S (Quiz Generator + AI Chatbot)
**Connects to:** New screens needed — none currently exist in the app

These features require **new screens** to be built.

### 6.1 AI Chatbot (new screen)

**API endpoints needed:**
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/v1/chatbot/chat` | Send message, receive AI response |
| GET | `/api/v1/chatbot/history` | Load chat history |
| GET | `/api/v1/chatbot/session/{id}` | Load specific session |
| DELETE | `/api/v1/chatbot/session/{id}` | Delete session |

**UI to build:**
- [ ] New screen `Screen13.tsx` — AI Chatbot
- [ ] Chat bubble UI (user messages right, AI messages left)
- [ ] Message input with send button
- [ ] Session history sidebar or back navigation
- [ ] Loading indicator while AI responds (streaming-friendly)
- [ ] Add route `AIChatbot` to `AppNavigator.tsx`
- [ ] Add entry point from Screen11 (Progress) or Screen6 (Map)

### 6.2 AI Tutor (new screen)

**API endpoints needed:**
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/chat` | Submit query, get AI tutoring response |
| GET | `/api/chat/history` | Load tutor conversation history |
| GET | `/api/usage` | Token/cost usage for user |

**UI to build:**
- [ ] New screen `Screen14.tsx` — AI Tutor
- [ ] Context-aware chat tied to current lesson topic
- [ ] Display token usage / session cost (optional, dev-mode only)
- [ ] Multi-model indicator (GPT / Gemini / LLaMA)
- [ ] Add route `AITutor` to `AppNavigator.tsx`
- [ ] Entry point: "Ask AI" button in Screen5 (LessonIntro) or Screen8 (Quiz)

### 6.3 AI Quiz Generator (new flow)

**API endpoints needed:**
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/v1/quiz/generate` | Generate quiz from topic |
| GET | `/api/v1/quiz/{id}` | Fetch generated quiz |
| POST | `/api/v1/quiz/{id}/submit` | Submit answers |
| GET | `/api/v1/quiz/{id}/results` | Get score + feedback |

**UI to build:**
- [ ] Add "Generate Practice Quiz" button in Screen7 (Explore) per course/topic
- [ ] Topic + difficulty input modal (reuse existing UI patterns)
- [ ] Route generated quiz into existing Screen8 (LessonQuiz) flow
- [ ] No new screen needed — thread through existing quiz screens

---

## Part 7 — Pod 4: Certificates & Streaks

**Owner:** Boobesh AG
**Connects to:** Screen9 (Achievements), Screen11 (Progress), Screen10 (LessonComplete)

### 7.1 Daily Streaks

**API endpoints needed:**
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/v1/streaks/{user_id}` | Current streak, longest streak, total days |
| POST | `/api/v1/streaks/activity` | Log user activity (auto-called on lesson complete) |
| GET | `/api/v1/streaks/leaderboard` | Top streak leaderboard |

**What needs to change:**
- [ ] Screen6 (Map) — wire streak count in top bar to real data from `/streaks/{user_id}`
- [ ] Screen11 (Progress) — show real streak, longest streak, total active days
- [ ] Screen9 (Achievements) — show streak milestone badge based on real data
- [ ] Screen10 (LessonComplete) — call `POST /streaks/activity` on lesson finish
- [ ] App launch — call `POST /streaks/activity` with `type: "login"` on each app open

### 7.2 Certificates

**API endpoints needed:**
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/v1/certificates` | List user's earned certificates |
| GET | `/api/v1/certificates/{cert_id}` | Get single certificate details |
| GET | `/api/v1/certificates/verify/{cert_id}` | Public verification endpoint |
| POST | `/api/v1/certificates` | Generate certificate (admin/instructor only) |
| GET | `/api/v1/certificates/{cert_id}/download` | Download PDF |

**UI to build:**
- [ ] Add "Certificates" section to Screen9 (Achievements) below badges
- [ ] Certificate card: course name, date earned, QR code preview, share button
- [ ] Share button → `Share` API (native) with LinkedIn/WhatsApp/Twitter links
- [ ] "Download PDF" button → open PDF URL in `expo-web-browser`
- [ ] QR scanner access (optional): link to `GET /verify/{cert_id}` web page

---

## Part 8 — Screen6 (Map) — Full Wiring

This is the home screen and most complex integration point.

- [ ] On mount: `GET /api/user/progress/map` → populate node statuses (completed/active/locked)
- [ ] Streak count in top bar → `GET /api/v1/streaks/{user_id}`
- [ ] Gems count → from `authStore` (returned by `/progress/map`)
- [ ] Tapping an active node → navigate to `LessonIntro` with `{lessonId, assessmentId}`
- [ ] Tapping a locked node → show "Complete previous lessons first" toast
- [ ] Bonus chest → open reward modal (design TBD)
- [ ] "AI Tutor" floating button (new) → navigate to `AITutor` screen

---

## Part 9 — Screen7 (Explore) — Full Wiring

- [ ] On mount: `GET /api/v1/problems` + `GET /api/v1/grammar/assessments` → populate course list
- [ ] Search input → filter courses client-side (or debounced API call)
- [ ] Category filter chips → filter by `topic` field
- [ ] "Enroll" button → `POST /api/user/enroll` with `{courseId}`
- [ ] Course card tap → navigate to week/day structure view
- [ ] "Generate Quiz" button (new) → open AI quiz generation modal (Pod 3)

---

## Part 10 — Screen11 (Progress) — Full Wiring

- [ ] On mount: `GET /api/user/stats` → real streak, hours coded, lessons done, progress %
- [ ] Streak data → `GET /api/v1/streaks/{user_id}`
- [ ] Certificates section (new) → `GET /api/v1/certificates`
- [ ] Recent activity feed → from stats API response
- [ ] "Next Lesson" card → tap navigates to `LessonIntro` with next lesson ID
- [ ] Quiz history → `GET /user/{uid}/history` (Pod 2b)

---

## Execution Order

Build in this sequence — each phase unblocks the next:

```
Phase 1 — Infrastructure
  1.1  API client (lib/api.ts)
  1.2  Token storage (lib/auth.ts)
  1.3  Zustand stores (store/)
  1.4  .env setup

Phase 2 — Auth (Pod 4)
  Screen4 login/signup/google wiring
  App.tsx boot token check
  Onboarding POST calls (Screen1–3)

Phase 3 — Core Learning Flow (Pod 1 + Pod 2a)
  Screen6 map loading
  Screen5 lesson intro loading
  Screen8 quiz attempt + answer submit
  Screen12 code execution (run + submit)
  Screen10 lesson completion + streak log

Phase 4 — Explore + Courses (Pod 2b)
  Screen7 course listing
  Week/day tree navigation
  Quiz session flow

Phase 5 — AI Features (Pod 3)
  Screen13 AI Chatbot (new screen)
  Screen14 AI Tutor (new screen)
  AI quiz generation in Screen7

Phase 6 — Achievements + Certs (Pod 4)
  Screen9 certificate section
  Screen11 streak + history
  PDF download + share
```

---

## Files to Create / Modify

| File | Action | Phase |
|------|--------|-------|
| `lib/api.ts` | Create | 1 |
| `lib/auth.ts` | Create | 1 |
| `store/authStore.ts` | Create | 1 |
| `store/progressStore.ts` | Create | 1 |
| `store/lessonStore.ts` | Create | 1 |
| `store/editorStore.ts` | Create | 1 |
| `.env` | Create | 1 |
| `screens/Screen4.tsx` | Modify | 2 |
| `App.tsx` | Modify | 2 |
| `screens/Screen1.tsx` | Modify | 2 |
| `screens/Screen2.tsx` | Modify | 2 |
| `screens/Screen3.tsx` | Modify | 2 |
| `screens/Screen6.tsx` | Modify | 3 |
| `screens/Screen5.tsx` | Modify | 3 |
| `screens/Screen8.tsx` | Modify | 3 |
| `screens/Screen12.tsx` | Modify | 3 |
| `screens/Screen10.tsx` | Modify | 3 |
| `screens/Screen7.tsx` | Modify | 4 |
| `screens/Screen13.tsx` | Create | 5 |
| `screens/Screen14.tsx` | Create | 5 |
| `navigation/AppNavigator.tsx` | Modify | 5 |
| `screens/Screen9.tsx` | Modify | 6 |
| `screens/Screen11.tsx` | Modify | 6 |

---

## Packages to Install

```bash
npx expo install expo-secure-store        # token storage
npx expo install expo-auth-session        # Google OAuth
npx expo install expo-web-browser         # PDF + OAuth redirects
npm install axios                          # HTTP client
npm install zustand                        # state management
npm install react-native-toast-message     # error/success toasts
```

---

## Backend API Base URL Reference

All endpoints are relative to `EXPO_PUBLIC_API_URL` (e.g., `http://localhost:8000`).

| Pod | Prefix | Owner |
|-----|--------|-------|
| Pod 1 Auth | `/api/v1/auth/` | Vaaheesan S |
| Pod 1 Assessments | `/api/v1/grammar/`, `/api/v1/reading/`, `/api/v1/listening/` | Vishvaa K |
| Pod 2a RCE | `/api/v1/problems`, `/api/v1/run`, `/api/v1/submit`, `/api/v1/submissions` | Pod 2a team |
| Pod 2b Quiz | `/courses/`, `/quiz/` | Pod 2b team |
| Pod 3 AI Chatbot | `/api/v1/chatbot/` | Ajay S |
| Pod 3 AI Tutor | `/api/chat/`, `/api/usage/` | Pooja S |
| Pod 3 Quiz Gen | `/api/v1/quiz/generate` | Ajay S |
| Pod 4 Streaks | `/api/v1/streaks/` | Boobesh AG |
| Pod 4 Certificates | `/api/v1/certificates/` | Boobesh AG |

---

*Last updated: 2026-03-26 — UI prototype complete, backend integration not started.*
