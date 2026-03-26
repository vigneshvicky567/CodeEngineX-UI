const fs = require('fs');

let file = fs.readFileSync('navigation/AppNavigator.tsx', 'utf8');

if (!file.includes('const { isLoggedIn } = useAuthStore();')) {
    file = file.replace(
      `import { View } from 'react-native';`,
      `import { View } from 'react-native';\nimport { useAuthStore } from '../store/authStore';`
    );

    file = file.replace(
        `export default function AppNavigator() {`,
        `export default function AppNavigator() {\n  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);`
    );

    file = file.replace(
`      {/* Onboarding & Auth */}
      <Stack.Screen name="Auth" component={Screen4} />
      <Stack.Screen name="PathSelection" component={Screen1} />
      <Stack.Screen name="ExperienceLevel" component={Screen2} />
      <Stack.Screen name="GoalSetting" component={Screen3} />

      {/* Main App (Tabs) */}
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />`,
`      {/* Dynamic based on auth state */}
      {!isLoggedIn ? (
        <>
          <Stack.Screen name="Auth" component={Screen4} />
          <Stack.Screen name="PathSelection" component={Screen1} />
          <Stack.Screen name="ExperienceLevel" component={Screen2} />
          <Stack.Screen name="GoalSetting" component={Screen3} />
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        </>
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        </>
      )}`
    );
}

fs.writeFileSync('navigation/AppNavigator.tsx', file);
