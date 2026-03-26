const fs = require('fs');
let file = fs.readFileSync('screens/Screen5.tsx', 'utf8');

if (!file.includes('import api from \'../lib/api\';')) {
    file = file.replace(
      `import { SafeAreaView } from 'react-native-safe-area-context';`,
      `import { SafeAreaView } from 'react-native-safe-area-context';\nimport api from '../lib/api';\nimport { useLessonStore } from '../store/lessonStore';\nimport { useRoute } from '@react-navigation/native';`
    );

    file = file.replace(
      `  const navigation = useNavigation<any>();`,
      `  const navigation = useNavigation<any>();\n  const route = useRoute<any>();\n  const [lessonData, setLessonData] = React.useState<any>(null);\n  const [isLoading, setIsLoading] = React.useState(true);\n  const { currentLessonId, assessmentId } = useLessonStore();`
    );

    file = file.replace(
`  // BACKEND: GET /api/lessons/{lessonId}
  // Endpoint to fetch lesson content, video URL, title, and rewards.
  // Response: { id: string, title: string, videoUrl: string, rewards: { xp: number, badges: string[] }, ... }
  /*
  useEffect(() => {
    // try {
    //   const data = await axios.get(\`/api/lessons/\${route.params.lessonId}\`);
    //   setLessonData(data);
    // } catch (e) { ... }
  }, []);
  */

  const handleContinue = () => {
    navigation.navigate('LessonQuiz');
  };`,
`  React.useEffect(() => {
    async function loadLesson() {
      try {
        const targetId = route.params?.assessmentId || assessmentId;
        if (!targetId) return;

        // BACKEND INTEGRATION POINT:
        // const data = await api.get(\`/api/v1/grammar/assessments/\${targetId}\`);
        // setLessonData(data);

        await new Promise(resolve => setTimeout(resolve, 500));
        setLessonData({
          title: "Epic Intro to Python",
          description: "We're diving into the snake-pit! Learn why Python is the coolest language for beginners and pro hackers alike.",
          xp: 50,
          badge: "Snake Charmer"
        });
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    loadLesson();
  }, [assessmentId, route.params]);

  const handleContinue = () => {
    navigation.navigate('LessonQuiz');
  };`
    );

    file = file.replace(
`            <Text className="font-headline font-bold text-2xl text-[#1CB0F6]">Lesson 1: Intro</Text>`,
`            <Text className="font-headline font-bold text-2xl text-[#1CB0F6]">{lessonData?.title || 'Loading...'}</Text>`
    );

    file = file.replace(
`            <Text className="font-headline text-4xl text-on-surface tracking-tight">Epic Intro to Python</Text>`,
`            <Text className="font-headline text-4xl text-on-surface tracking-tight">{lessonData?.title || '...'}</Text>`
    );

    file = file.replace(
`                We're diving into the snake-pit! Learn why Python is the coolest language for beginners and pro hackers alike.`,
`                {lessonData?.description || '...'}`
    );

    file = file.replace(
`                  <Text className="text-on-surface-variant text-sm font-medium">50 Experience Points</Text>`,
`                  <Text className="text-on-surface-variant text-sm font-medium">{lessonData?.xp || 0} Experience Points</Text>`
    );

    file = file.replace(
`                  <Text className="text-on-surface-variant text-sm font-medium">"Snake Charmer" Badge</Text>`,
`                  <Text className="text-on-surface-variant text-sm font-medium">"{lessonData?.badge || 'None'}" Badge</Text>`
    );
}

fs.writeFileSync('screens/Screen5.tsx', file);
