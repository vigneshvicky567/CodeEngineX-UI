const fs = require('fs');
let file = fs.readFileSync('screens/Screen9.tsx', 'utf8');

if (!file.includes('import api from \'../lib/api\';')) {
    file = file.replace(
      `import { SafeAreaView } from 'react-native-safe-area-context';`,
      `import { SafeAreaView } from 'react-native-safe-area-context';\nimport api from '../lib/api';\nimport * as WebBrowser from 'expo-web-browser';`
    );

    file = file.replace(
      `  const navigation = useNavigation<any>();`,
      `  const navigation = useNavigation<any>();\n  const [certs, setCerts] = React.useState<any[]>([]);\n  const [achievements, setAchievements] = React.useState<any>(null);`
    );

    file = file.replace(
`  // BACKEND: GET /api/user/achievements
  // Endpoint to fetch earned badges, recent activity, and milestones.
  // Response: {
  //   level: number,
  //   badges: { earned: Array<{ id: string, name: string, icon: string }>, total: number },
  //   recentActivity: Array<{ id: string, title: string, time: string, type: string }>,
  //   milestones: { streak: number, linesCoded: number, firstProject: boolean },
  //   featuredAchievement: { title: string, desc: string, image: string }
  // }
  /*
  useEffect(() => {
    // try {
    //   const data = await axios.get('/api/user/achievements');
    //   setAchievementsData(data);
    // } catch (e) { ... }
  }, []);
  */`,
`  React.useEffect(() => {
    async function fetchData() {
      try {
        // BACKEND INTEGRATION POINT:
        // const certData = await api.get('/api/v1/certificates');
        // setCerts(certData);
        // const achData = await api.get('/api/v1/user/achievements'); // Note: Endpoint may vary based on Pod 4
        // setAchievements(achData);

        await new Promise(resolve => setTimeout(resolve, 500));
        setCerts([
          { id: 'cert-1', courseName: 'Basic Python', dateEarned: '2026-03-20', pdfUrl: 'https://example.com/cert1.pdf' }
        ]);
      } catch (e) {
        console.error(e);
      }
    }
    fetchData();
  }, []);

  const openCert = async (url: string) => {
    if (url) {
       await WebBrowser.openBrowserAsync(url);
    }
  };`
    );

    file = file.replace(
`        <View className="px-6 mb-8 mt-4">
          <View className="flex-row justify-between items-center mb-6">`,
`        {/* Certificates Section */}
        <View className="px-6 mb-8 mt-4">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="font-headline font-bold text-2xl text-on-surface">Certificates</Text>
            <Pressable>
              <Text className="font-label font-bold text-sm uppercase text-primary tracking-widest">VIEW ALL</Text>
            </Pressable>
          </View>
          <View className="gap-4">
            {certs.length === 0 ? (
                <Text className="text-on-surface-variant italic">No certificates yet. Keep learning!</Text>
            ) : certs.map((cert: any) => (
                <View key={cert.id} className="bg-surface-container-lowest border-2 border-outline-variant p-4 rounded-xl flex-row items-center justify-between">
                    <View className="flex-col">
                        <Text className="font-headline font-bold text-lg text-on-surface">{cert.courseName}</Text>
                        <Text className="text-sm text-on-surface-variant">Earned: {cert.dateEarned}</Text>
                    </View>
                    <Pressable onPress={() => openCert(cert.pdfUrl)} className="bg-primary/10 p-2 rounded-full">
                        <MaterialIcons name="download" size={24} color="#00628c" />
                    </Pressable>
                </View>
            ))}
          </View>
        </View>

        <View className="px-6 mb-8">
          <View className="flex-row justify-between items-center mb-6">`
    );
}

fs.writeFileSync('screens/Screen9.tsx', file);
