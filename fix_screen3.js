const fs = require('fs');
let file = fs.readFileSync('screens/Screen3.tsx', 'utf8');

if (!file.includes('import api from \'../lib/api\';')) {
    file = file.replace(
      `import { SafeAreaView } from 'react-native-safe-area-context';`,
      `import { SafeAreaView } from 'react-native-safe-area-context';\nimport api from '../lib/api';`
    );

    file = file.replace(
`  const handleContinue = () => {
    // BACKEND INTEGRATION POINT:
    // try {
    //   await axios.post('/api/user/goal', { dailyGoalMinutes: selected });
    // } catch (e) { ... }
    navigation.navigate('MainTabs');
  };`,
`  const handleContinue = async () => {
    try {
      // BACKEND INTEGRATION POINT:
      // await api.post('/api/user/goal', { dailyGoalMinutes: selected });
      await new Promise(resolve => setTimeout(resolve, 300));
      navigation.navigate('MainTabs');
    } catch (e) {
      console.error(e);
      navigation.navigate('MainTabs');
    }
  };`
    );
}

fs.writeFileSync('screens/Screen3.tsx', file);
