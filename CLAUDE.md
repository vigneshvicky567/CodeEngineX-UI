# CodeEngineX-UI — CLAUDE.md

## Project Overview

**CodeQuest** — a Duolingo-style mobile app for learning to code, built with Expo + React Native.

- **Stack**: Expo SDK, React Native 0.83.2, React 19.2.0, TypeScript
- **Styling**: NativeWind v4 (Tailwind CSS for React Native)
- **Navigation**: React Navigation v7 — native-stack + bottom-tabs
- **Icons**: `@expo/vector-icons` (MaterialIcons)
- **IDE feature**: Monaco Editor via WebView (CDN-loaded) in Screen12

---

## Key Conventions

### Imports
- Always use `SafeAreaView` from `react-native-safe-area-context` — NOT from `react-native`
- Static arrays (options, tabs, keys) must be defined at **module scope**, not inside component functions

### Navigation Routes
```
Auth (Screen4) → PathSelection (Screen3) / MainTabs
MainTabs: Map (Screen6) | Explore (Screen7) | Achievements (Screen9) | Progress (Screen11)
Lesson stack: LessonIntro (Screen5) → Quiz (Screen8) → FillBlank (Screen10) → MobileIDE (Screen12)
```

### Bottom Navigation
All main tab screens use the shared `BottomNavBar` component with the **correct** NAV_TABS:
```tsx
const NAV_TABS: TabItem[] = [
  { name: 'Learn',   icon: 'school',        route: 'Map'          },
  { name: 'Explore', icon: 'explore',        route: 'Explore'      },
  { name: 'Badges',  icon: 'military-tech',  route: 'Achievements' },
  { name: 'Profile', icon: 'person',         route: 'Progress'     },
];
```

### Top App Bar
Use `components/TopAppBar.tsx` — do NOT write inline top bar JSX in screens.

| Screen | Usage |
|--------|-------|
| Screen6, Screen7 | `<TopAppBar showBrand className="bg-white/90" rightContent={...} />` |
| Screen9 | `<TopAppBar showBrand onMenu={() => {}} className="bg-white/90" rightContent={...} />` |
| Screen11 | `<TopAppBar onBack={() => navigation.goBack()} title="My Progress" className="bg-[#f0f9ff]" rightContent={...} />` |

Screens 1–3, 5, 8, 10 have unique top bars (progress indicators / close buttons) — keep those inline.

---

## Shared Components

| File | Purpose |
|------|---------|
| `components/BottomNavBar.tsx` | Bottom tab bar — `activeTab`, `tabs`, `containerClassName` |
| `components/TopAppBar.tsx` | Top app bar — `showBrand`, `onBack`, `onMenu`, `title`, `rightContent`, `className` |
| `components/Editor/CodeEditor.tsx` | Monaco editor via WebView (dark/light, multi-language) |

---

## Backend Integration

Backend is **not yet implemented**. All API calls are stubbed with comments:
```tsx
// BACKEND: GET /api/user/progress/map
// BACKEND: POST /api/quizzes/{quizId}/submit
```
Do not remove these comments — they are the integration spec for the backend team.

OAuth buttons (Apple, Google) on Screen4 are UI-only stubs. Do not wire them up without backend context.

---

## What NOT to Change

- Do not touch `navigation/AppNavigator.tsx` route names without updating all `navigation.navigate()` calls
- Do not change font loading logic in `App.tsx` — it has proper error handling and isMounted guard
- Do not add a Leaderboard or Practice tab to `NAV_TABS` — those routes do not exist in the navigator
