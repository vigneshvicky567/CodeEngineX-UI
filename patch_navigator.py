import re

with open('navigation/AppNavigator.tsx', 'r') as f:
    content = f.read()

import_auth = "import { useAuthStore } from '../store/authStore';\n"
content = import_auth + content

stack_screen = """
export default function AppNavigator() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isLoggedIn ? (
        <>
          <Stack.Screen name="Auth" component={Screen4} />
          <Stack.Screen name="PathSelection" component={Screen1} />
          <Stack.Screen name="ExperienceLevel" component={Screen2} />
          <Stack.Screen name="GoalSetting" component={Screen3} />
        </>
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
          <Stack.Screen name="LessonIntro" component={Screen5} />
          <Stack.Screen name="LessonQuiz" component={Screen8} />
          <Stack.Screen name="LessonComplete" component={Screen10} />
          <Stack.Screen name="MobileIDE" component={Screen12} />
          <Stack.Screen name="CodeEditor" component={EditorScreenWrapper} />
        </>
      )}
    </Stack.Navigator>
  );
}
"""

content = re.sub(r'export default function AppNavigator\(\) \{.*?(?=\Z)', stack_screen, content, flags=re.DOTALL)

with open('navigation/AppNavigator.tsx', 'w') as f:
    f.write(content)
