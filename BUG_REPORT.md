# Bug Report — CodeEngineX-UI

All previously reported issues have been resolved. This document reflects the current state of the codebase.

---

## Resolved Issues

### ✅ 1. Error Handling & Memory Leak in App.tsx
- **Was**: `Font.loadAsync` called without try-catch, no `isMounted` guard.
- **Fixed**: `App.tsx` now uses `isMounted` flag + try/catch/finally around font loading.

### ✅ 2. Logic Error in Option Selection (Screen8)
- **Was**: `options[selectedOption]` (index-based lookup — fragile if list order changes).
- **Fixed**: `options.find(opt => opt.id === selectedOption)` — id-based lookup.

### ✅ 3. Deprecated SafeAreaView (Screen4, Screen8)
- **Was**: `SafeAreaView` imported from `react-native` (deprecated, buggy on Android).
- **Fixed**: Both screens import `SafeAreaView` from `react-native-safe-area-context`.

### ✅ 4. Static Arrays Recreated on Every Render
- **Was**: `options` / `keys` arrays defined inside component functions.
- **Fixed**: All static arrays (Screen1–3, Screen8, Screen12) are defined at module scope.

### ✅ 5. Incorrect React Keys in Map (Screen9, Screen12)
- **Was**: Array index used as `key` in `.map()` calls.
- **Fixed**: Screen9 uses `badge.title` as key; Screen12 uses `k` (the string value) as key.

---

## Frontend Cleanup (2026-03-26)

The following issues were identified and fixed as part of a frontend cleanup pass:

### ✅ 6. Wrong Brand Name "CodeLego" in Screen9
- **Was**: `<Text>CodeLego</Text>` in the TopAppBar of the Achievements screen.
- **Fixed**: Corrected to "CodeQuest" via the shared `TopAppBar` component.

### ✅ 7. Incorrect NAV_TABS in Main Tab Screens
- **Was**: Screen6 had `Shield/verified-user`, Screen7 had `Shield/verified-user`, Screen9 had `Leaderboard/leaderboard`, Screen11 had `Practice/terminal` and `Leaderboard/emoji-events`.
- **Fixed**: All four screens now use the correct tabs:
  ```
  Learn → Map
  Explore → Explore
  Badges → Achievements
  Profile → Progress
  ```

### ✅ 8. Inline BottomNavBar Duplicated Across 4 Screens
- **Was**: 27 lines of inline BottomNavBar JSX copy-pasted in Screen6, Screen7, Screen9, Screen11 — each with a hard-coded active-state comparison like `'Learn' === 'Profile'` (always false).
- **Fixed**: All four screens now use `<BottomNavBar activeTab="..." tabs={NAV_TABS} />`.

### ✅ 9. Inline TopAppBar Duplicated Across 4 Screens
- **Was**: 15–20 lines of inline TopAppBar JSX in each main tab screen.
- **Fixed**: Extracted to `components/TopAppBar.tsx` with props: `showBrand`, `onBack`, `onMenu`, `title`, `rightContent`, `className`.

---

## Current State

**No open bugs.** The codebase is frontend-complete for the UI prototype phase. Backend integration points are stubbed with comments (`// BACKEND: ...`) throughout the screens.
