const fs = require('fs');
let file = fs.readFileSync('screens/Screen2.tsx', 'utf8');

if (!file.includes('import api from \'../lib/api\';')) {
    file = file.replace(
      `import { SafeAreaView } from 'react-native-safe-area-context';`,
      `import { SafeAreaView } from 'react-native-safe-area-context';\nimport api from '../lib/api';`
    );

    file = file.replace(
`  const handleContinue = () => {
    // BACKEND INTEGRATION POINT:
    // try {
    //   await axios.post('/api/user/experience', { level: selected });
    // } catch (e) { ... }
    navigation.navigate('GoalSetting');
  };`,
`  const handleContinue = async () => {
    try {
      // BACKEND INTEGRATION POINT:
      // await api.post('/api/user/experience', { level: selected });
      await new Promise(resolve => setTimeout(resolve, 300));
      navigation.navigate('GoalSetting');
    } catch (e) {
      console.error(e);
      navigation.navigate('GoalSetting');
    }
  };`
    );
}

fs.writeFileSync('screens/Screen2.tsx', file);
