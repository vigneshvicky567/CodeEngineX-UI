const fs = require('fs');

let file = fs.readFileSync('screens/Screen4.tsx', 'utf8');

file = file.replace(
`  const handleLogin = () => {
    // BACKEND INTEGRATION POINT:
    // try {
    //   const res = await axios.post('/api/auth/login', credentials);
    //   saveToken(res.data.token);
    // } catch (e) { ... }
    navigation.navigate('MainTabs');
  };`,
`  const handleLogin = async () => {
    setIsLoading(true);
    try {
      // BACKEND INTEGRATION POINT:
      // const res = await api.post('/api/v1/auth/login', { email: 'test@example.com', password: 'password123' });
      // await login(res.access_token, res.refresh_token, res.user);
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate loading
      await login('dummy_token');
      navigation.navigate('MainTabs');
    } catch (e: any) {
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: e.response?.data?.detail || 'An error occurred during login.',
      });
    } finally {
      setIsLoading(false);
    }
  };`
);

fs.writeFileSync('screens/Screen4.tsx', file);
