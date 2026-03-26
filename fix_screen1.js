const fs = require('fs');
let file = fs.readFileSync('screens/Screen1.tsx', 'utf8');

if (!file.includes('import api from \'../lib/api\';')) {
    file = file.replace(
      `import { SafeAreaView } from 'react-native-safe-area-context';`,
      `import { SafeAreaView } from 'react-native-safe-area-context';\nimport api from '../lib/api';\nimport { useAuthStore } from '../store/authStore';`
    );

    file = file.replace(
      `  const navigation = useNavigation<any>();\n  const [selected, setSelected] = useState<string | null>('Web Dev');`,
      `  const navigation = useNavigation<any>();\n  const [selected, setSelected] = useState<string | null>('Web Dev');\n  const user = useAuthStore((state) => state.user);`
    );

    file = file.replace(
`  const handleContinue = () => {
    // BACKEND INTEGRATION POINT:
    // try {
    //   await axios.post('/api/user/path', { selectedPath: selected });
    // } catch (e) { ... }
    navigation.navigate('ExperienceLevel');
  };`,
`  const handleContinue = async () => {
    try {
      // BACKEND INTEGRATION POINT:
      // await api.post('/api/user/path', { selectedPath: selected });
      await new Promise(resolve => setTimeout(resolve, 300));
      navigation.navigate('ExperienceLevel');
    } catch (e) {
      console.error(e);
      navigation.navigate('ExperienceLevel');
    }
  };`
    );
}

fs.writeFileSync('screens/Screen1.tsx', file);
