const fs = require('fs');
let file = fs.readFileSync('screens/Screen10.tsx', 'utf8');

if (!file.includes('import api from \'../lib/api\';')) {
    file = file.replace(
      `import { SafeAreaView } from 'react-native-safe-area-context';`,
      `import { SafeAreaView } from 'react-native-safe-area-context';\nimport api from '../lib/api';\nimport { useLessonStore } from '../store/lessonStore';\nimport { useProgressStore } from '../store/progressStore';\nimport { useAuthStore } from '../store/authStore';`
    );

    file = file.replace(
      `  const navigation = useNavigation<any>();`,
      `  const navigation = useNavigation<any>();\n  const { currentLessonId, attemptId, clearLesson } = useLessonStore();\n  const { user } = useAuthStore();\n  const { setGems, gems, setStreakData, streak, longestStreak, totalDays, addCompletedNode } = useProgressStore();\n  const [isLoading, setIsLoading] = React.useState(false);`
    );

    file = file.replace(
`  // BACKEND: POST /api/lessons/{lessonId}/complete
  // Endpoint to finalize the lesson completion.
  // Updates user XP, unlocks next nodes, updates daily streak, and syncs leaderboard stats.
  // Request body: { userId: string, score: number, timeSpent: number }
  // Response: { success: boolean, totalXp: number, newGems: number, leveledUp: boolean }
  const handleComplete = () => {
    // BACKEND INTEGRATION POINT:
    // try {
    //   await axios.post(\`/api/lessons/\${lessonId}/complete\`, { score: 100 });
    // } catch (e) { ... }
    navigation.navigate('MainTabs', { screen: 'Map' });
  };`,
`  const handleComplete = async () => {
    setIsLoading(true);
    try {
      // BACKEND INTEGRATION POINT: Finalize lesson and update streak
      // if (attemptId) {
      //    await api.post(\`/api/v1/.../attempts/\${attemptId}/submit\`);
      // }
      // if (currentLessonId) {
      //    await api.post(\`/api/lessons/\${currentLessonId}/complete\`);
      // }
      // await api.post('/api/v1/streaks/activity', { type: 'lesson_complete' });

      await new Promise(resolve => setTimeout(resolve, 500));

      // Update local state
      setGems(gems + 2);
      setStreakData(streak + 1, Math.max(longestStreak, streak + 1), totalDays + 1);
      if (currentLessonId) addCompletedNode(currentLessonId);

      clearLesson();
      navigation.navigate('MainTabs', { screen: 'Map' });
    } catch (e) {
      console.error(e);
      navigation.navigate('MainTabs', { screen: 'Map' });
    } finally {
      setIsLoading(false);
    }
  };`
    );

    file = file.replace(
`        <Pressable
          onPress={handleComplete}
          className="w-full py-5 bg-primary rounded-lg active:scale-95"`,
`        <Pressable
          onPress={handleComplete}
          disabled={isLoading}
          className={\`w-full py-5 bg-primary rounded-lg active:scale-95 \${isLoading ? 'opacity-70' : ''}\`}`
    );
}

fs.writeFileSync('screens/Screen10.tsx', file);
