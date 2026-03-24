# Bug and Leak Report

## Critical Issues

### 1. Missing Error Handling & Potential Memory Leak in App.tsx
- **Location**: `App.tsx`, lines 39-60
- **Problem**: The `Font.loadAsync` function is called without a `try-catch` block. If font loading fails (e.g., due to network issues if loaded remotely, or missing assets), the app will crash or remain stuck in the loading state indefinitely. Furthermore, there is no `isMounted` check within the `useEffect`. If the `App` component is unmounted before `Font.loadAsync` resolves, calling `setFontsLoaded(true)` will attempt to update state on an unmounted component, leading to a memory leak warning in React.
- **Impact**: App crash, infinite loading screen, memory leak warning.
- **Fix**:
```tsx
  useEffect(() => {
    let isMounted = true;
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'Fredoka': Fredoka_400Regular,
          'Fredoka-Medium': Fredoka_500Medium,
          'Fredoka-SemiBold': Fredoka_600SemiBold,
          'Fredoka-Bold': Fredoka_700Bold,
          'PlusJakartaSans': PlusJakartaSans_400Regular,
          'PlusJakartaSans-Medium': PlusJakartaSans_500Medium,
          'PlusJakartaSans-SemiBold': PlusJakartaSans_600SemiBold,
          'PlusJakartaSans-Bold': PlusJakartaSans_700Bold,
          'PlusJakartaSans-ExtraBold': PlusJakartaSans_800ExtraBold,
          'BeVietnamPro': BeVietnamPro_400Regular,
          'BeVietnamPro-Medium': BeVietnamPro_500Medium,
          'BeVietnamPro-SemiBold': BeVietnamPro_600SemiBold,
          'BeVietnamPro-Bold': BeVietnamPro_700Bold,
          'FiraCode': FiraCode_400Regular,
          'FiraCode-Medium': FiraCode_500Medium,
        });
        if (isMounted) setFontsLoaded(true);
      } catch (error) {
        console.warn("Error loading fonts", error);
        // Fallback or error handling
        if (isMounted) setFontsLoaded(true); // Continue anyway to not block user
      }
    }
    loadFonts();
    return () => {
      isMounted = false;
    };
  }, []);
```

## Important Issues

### 2. Logic Error in Option Selection
- **Location**: `screens/Screen8.tsx`, line 24
- **Problem**: `currentOption` is derived directly using `selectedOption` as an array index: `const currentOption = selectedOption !== null ? options[selectedOption] : null;`. If the `id` of an option doesn't perfectly match its array index (e.g. if the list is re-ordered or filtered), this will result in the wrong option being selected or an out-of-bounds error.
- **Impact**: Incorrect validation logic, potential crash if out of bounds.
- **Fix**:
```tsx
  const currentOption = selectedOption !== null ? options.find(opt => opt.id === selectedOption) : null;
```

### 3. UI Deprecation & Android Inconsistency
- **Location**: `screens/Screen4.tsx` (line 2), `screens/Screen8.tsx` (line 2)
- **Problem**: `SafeAreaView` is imported from `react-native`. This version of `SafeAreaView` is deprecated and notoriously buggy on Android devices, often failing to properly apply padding for notches and status bars. It should be imported from `react-native-safe-area-context` like it is in the other screens.
- **Impact**: UI overlap with system bars on Android devices, leading to an unusable interface.
- **Fix**:
```tsx
// Remove SafeAreaView from react-native import
import { View, Text, Pressable, Dimensions } from 'react-native';
// Add correct import
import { SafeAreaView } from 'react-native-safe-area-context';
```

## Minor Issues

### 4. Performance: Unnecessary Array Recreation
- **Location**: `screens/Screen1.tsx` (lines 11-18), `screens/Screen2.tsx` (lines 11-15), `screens/Screen3.tsx` (lines 11-16), `screens/Screen8.tsx` (lines 12-17), `screens/Screen12.tsx` (line 12).
- **Problem**: Static arrays like `options` and `keys` are defined inside the functional component. This means they are recreated on every single render cycle, wasting memory allocation and potentially causing unnecessary re-renders in child components if passed as props.
- **Impact**: Slight performance degradation and increased garbage collection overhead.
- **Fix**: Move the arrays outside the component definition.
```tsx
// Outside the component
const options = [
  // ...
];

export default function Screen1() {
  // ...
}
```

### 5. Performance: Missing Key in Array Map / Using Index as Key
- **Location**: `screens/Screen9.tsx` (line 89), `screens/Screen12.tsx` (line 74)
- **Problem**: In `Screen9.tsx`, the `map` function for locked badges uses the array index as the React `key`. In `Screen12.tsx`, the keys map uses the index `i` as the `key`. While the arrays are static here, it's a poor practice that can lead to subtle rendering bugs if the array ever changes. It's better to use a unique identifier or the string value itself.
- **Impact**: Suboptimal React rendering reconciliation.
- **Fix**:
```tsx
// Screen9.tsx
{lockedBadges.map((badge) => (
  <View key={badge.title} ...>
// Screen12.tsx
{keys.map((k) => (
  <Pressable key={k} ...>
```

## Summary & Code Health Assessment

**Summary of Issues:**
*   **Critical**: 1 (Error Handling & Memory Leak in App.tsx)
*   **Important**: 2 (Logic error in Screen8, UI Deprecation in Screen4 & Screen8)
*   **Minor**: 2 (Performance optimizations across multiple screens)

**Overall Code Health Assessment:**
The codebase is generally well-structured and uses modern React Native practices (functional components, hooks, Tailwind/NativeWind for styling). However, the lack of error handling around asynchronous startup tasks (font loading) is a critical vulnerability that must be addressed to ensure app stability. The logic error in Screen8 highlights a need for more robust data handling (avoiding index-based lookups). The performance issues (recreating arrays) are minor but pervasive, indicating a slight gap in React performance optimization knowledge. Overall, the code health is fair, but fixing these foundational issues will significantly improve stability and maintainability.
