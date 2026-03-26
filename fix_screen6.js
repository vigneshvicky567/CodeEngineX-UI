const fs = require('fs');
let file = fs.readFileSync('screens/Screen6.tsx', 'utf8');

if (!file.includes('import api from \'../lib/api\';')) {
    file = file.replace(
      `import { SafeAreaView } from 'react-native-safe-area-context';`,
      `import { SafeAreaView } from 'react-native-safe-area-context';\nimport api from '../lib/api';\nimport { useProgressStore } from '../store/progressStore';\nimport { useAuthStore } from '../store/authStore';\nimport { useLessonStore } from '../store/lessonStore';`
    );

    file = file.replace(
      `  const navigation = useNavigation<any>();`,
      `  const navigation = useNavigation<any>();\n  const { gems, streak, setStreakData, setGems, setNodes, activeNodes, completedNodes } = useProgressStore();\n  const { user } = useAuthStore();\n  const setCurrentLesson = useLessonStore((state) => state.setCurrentLesson);\n  const [isLoading, setIsLoading] = React.useState(true);`
    );

    file = file.replace(
`  // BACKEND: GET /api/user/progress/map
  // Endpoint to fetch the user's current progress on the learning map.
  // Response: {
  //   stats: { gems: number, streak: number },
  //   nodes: Array<{ id: string, type: string, status: 'completed' | 'active' | 'locked', label: string }>
  // }
  /*
  useEffect(() => {
    // try {
    //   const data = await axios.get('/api/user/progress/map');
    //   setMapData(data);
    // } catch (e) { ... }
  }, []);
  */

  const handleStartLevel = () => {
    navigation.navigate('LessonIntro');
  };`,
`  React.useEffect(() => {
    async function loadData() {
      try {
        // BACKEND INTEGRATION POINT:
        // const mapData = await api.get('/api/user/progress/map');
        // setGems(mapData.stats.gems);
        // const streakData = await api.get(\`/api/v1/streaks/\${user?.id || 'me'}\`);
        // setStreakData(streakData.streak, streakData.longestStreak, streakData.totalDays);
        // setNodes(
        //   mapData.nodes.filter(n => n.status === 'completed').map(n => n.id),
        //   mapData.nodes.filter(n => n.status === 'active').map(n => n.id)
        // );

        // Mock data loading
        await new Promise(resolve => setTimeout(resolve, 500));
        setGems(15);
        setStreakData(2, 5, 10);
      } catch (e) {
        console.error('Failed to load map data', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [user]);

  const handleStartLevel = (lessonId: string, assessmentId: string) => {
    setCurrentLesson(lessonId, assessmentId);
    navigation.navigate('LessonIntro', { lessonId, assessmentId });
  };`
    );

    file = file.replace(
`              <MaterialIcons name="favorite" size={20} color="#b31b25" />
              <Text className="font-headline font-bold text-error">5</Text>
            </View>
            <View className="flex-row items-center gap-1 bg-surface-container-low px-3 py-1 rounded-full border-b-2 border-tertiary-dim/20">
              <MaterialIcons name="local-fire-department" size={20} color="#edba00" />
              <Text className="font-headline font-bold text-tertiary-fixed-dim">12</Text>`,
`              <MaterialIcons name="favorite" size={20} color="#b31b25" />
              <Text className="font-headline font-bold text-error">{gems}</Text>
            </View>
            <View className="flex-row items-center gap-1 bg-surface-container-low px-3 py-1 rounded-full border-b-2 border-tertiary-dim/20">
              <MaterialIcons name="local-fire-department" size={20} color="#edba00" />
              <Text className="font-headline font-bold text-tertiary-fixed-dim">{streak}</Text>`
    );

    file = file.replace(
`          <View className="relative z-20 my-4">
            <View className="absolute inset-0 bg-primary-container/40 rounded-full scale-150" />
            <Pressable
              onPress={handleStartLevel}
              className="w-24 h-24 bg-primary rounded-full flex items-center justify-center active:scale-95"`,
`          <View className="relative z-20 my-4">
            <View className="absolute inset-0 bg-primary-container/40 rounded-full scale-150" />
            <Pressable
              onPress={() => handleStartLevel('lesson-1', 'assessment-1')}
              className="w-24 h-24 bg-primary rounded-full flex items-center justify-center active:scale-95"`
    );
}

fs.writeFileSync('screens/Screen6.tsx', file);
