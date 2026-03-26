const fs = require('fs');
let file = fs.readFileSync('screens/Screen11.tsx', 'utf8');

if (!file.includes('import api from \'../lib/api\';')) {
    file = file.replace(
      `import { SafeAreaView } from 'react-native-safe-area-context';`,
      `import { SafeAreaView } from 'react-native-safe-area-context';\nimport api from '../lib/api';\nimport { useProgressStore } from '../store/progressStore';\nimport { useAuthStore } from '../store/authStore';`
    );

    file = file.replace(
      `  const navigation = useNavigation<any>();`,
      `  const navigation = useNavigation<any>();\n  const { streak } = useProgressStore();\n  const { logout, user } = useAuthStore();\n  const [stats, setStats] = React.useState<any>(null);`
    );

    file = file.replace(
`  // BACKEND: GET /api/user/stats
  // Endpoint to fetch the user's detailed progress statistics.
  // Response: {
  //   streak: number,
  //   progressPercent: number,
  //   hoursCoded: number,
  //   lessonsDone: number,
  //   recentActivity: Array<{ title: string, time: string, xp: number, type: string }>,
  //   nextLesson: { title: string, desc: string, id: string }
  // }
  /*
  useEffect(() => {
    // try {
    //   const data = await axios.get('/api/user/stats');
    //   setStatsData(data);
    // } catch (e) { ... }
  }, []);
  */`,
`  React.useEffect(() => {
    async function loadStats() {
      try {
        // BACKEND INTEGRATION POINT: Pod 4 stats
        // const data = await api.get('/api/v1/user/stats');
        // setStats(data);

        await new Promise(resolve => setTimeout(resolve, 500));
        setStats({
          hoursCoded: 42,
          lessonsDone: 156,
          progressPercent: 68
        });
      } catch (e) {
        console.error(e);
      }
    }
    loadStats();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
  };`
    );

    file = file.replace(
`        <TopAppBar
          onBack={() => navigation.goBack()}
          title="My Progress"
          className="bg-[#f0f9ff]"
          rightContent={
            <MaterialIcons name="share" size={24} color="#1CB0F6" />
          }
        />`,
`        <TopAppBar
          onBack={() => navigation.goBack()}
          title="My Progress"
          className="bg-[#f0f9ff]"
          rightContent={
            <Pressable onPress={handleLogout} className="active:opacity-70 p-2">
              <MaterialIcons name="logout" size={24} color="#ef4444" />
            </Pressable>
          }
        />`
    );

    file = file.replace(
`                <Text className="font-headline font-bold text-3xl text-on-surface">12</Text>`,
`                <Text className="font-headline font-bold text-3xl text-on-surface">{streak}</Text>`
    );
}

fs.writeFileSync('screens/Screen11.tsx', file);
