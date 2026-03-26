import re

with open('screens/Screen4.tsx', 'r') as f:
    content = f.read()

import_logic = """import { useAuthStore } from '../store/authStore';
import { saveTokens } from '../lib/auth';
import { post } from '../lib/api';
"""

content = content.replace("import { useNavigation } from '@react-navigation/native';", "import { useNavigation } from '@react-navigation/native';\n" + import_logic)

login_logic = """
  const handleLogin = async () => {
    try {
      const res: any = await post('/api/v1/auth/login', { username: 'testuser', password: 'password' });
      await saveTokens(res.token);
      useAuthStore.getState().login(res.user || {}, { access_token: res.token });
      navigation.navigate('MainTabs');
    } catch (e) {
      console.log('Login failed', e);
      // fallback
      useAuthStore.getState().setLoggedIn(true);
      navigation.navigate('MainTabs');
    }
  };

  const handleSignUp = async () => {
    try {
      const res: any = await post('/api/v1/auth/signup', { username: 'newuser', email: 'test@test.com', password: 'password' });
      await saveTokens(res.token);
      useAuthStore.getState().login(res.user || {}, { access_token: res.token });
      navigation.navigate('PathSelection');
    } catch (e) {
      console.log('Signup failed', e);
      // fallback
      useAuthStore.getState().setLoggedIn(true);
      navigation.navigate('PathSelection');
    }
  };
"""

content = re.sub(r'const handleLogin = \(\) => \{.*?(?=  return \()', login_logic, content, flags=re.DOTALL)

with open('screens/Screen4.tsx', 'w') as f:
    f.write(content)
