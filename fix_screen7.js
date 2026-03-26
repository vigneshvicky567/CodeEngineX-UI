const fs = require('fs');
let file = fs.readFileSync('screens/Screen7.tsx', 'utf8');

if (!file.includes('import api from \'../lib/api\';')) {
    file = file.replace(
      `import { SafeAreaView } from 'react-native-safe-area-context';`,
      `import { SafeAreaView } from 'react-native-safe-area-context';\nimport api from '../lib/api';\nimport { useAuthStore } from '../store/authStore';\nimport { useProgressStore } from '../store/progressStore';`
    );

    file = file.replace(
      `  const navigation = useNavigation<any>();`,
      `  const navigation = useNavigation<any>();\n  const [courses, setCourses] = React.useState<any[]>([]);\n  const { gems, streak } = useProgressStore();`
    );

    file = file.replace(
`  // BACKEND: GET /api/courses
  // Endpoint to fetch available courses and user's enrollment status.
  // Response: Array<{ id: string, title: string, description: string, tags: string[], isEnrolled: boolean }>
  /*
  useEffect(() => {
    // try {
    //   const data = await axios.get('/api/courses');
    //   setCoursesData(data);
    // } catch (e) { ... }
  }, []);
  */

  const handleStartCourse = () => {
    navigation.navigate('LessonIntro');
  };`,
`  React.useEffect(() => {
    async function fetchCourses() {
      try {
        // BACKEND INTEGRATION POINT:
        // const problems = await api.get('/api/v1/problems');
        // const grammar = await api.get('/api/v1/grammar/assessments');
        // setCourses([...problems, ...grammar]);
      } catch (e) {
        console.error('Failed to fetch courses', e);
      }
    }
    fetchCourses();
  }, []);

  const handleStartCourse = () => {
    navigation.navigate('LessonIntro');
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
}

fs.writeFileSync('screens/Screen7.tsx', file);
