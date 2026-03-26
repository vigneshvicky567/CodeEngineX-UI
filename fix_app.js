const fs = require('fs');

let file = fs.readFileSync('App.tsx', 'utf8');

if (!file.includes('import { useAuthStore } from \'./store/authStore\';')) {
  file = file.replace(
    `import './global.css';`,
    `import './global.css';\nimport { useAuthStore } from './store/authStore';\nimport Toast from 'react-native-toast-message';`
  );
}

if (!file.includes('const { checkAuth } = useAuthStore();')) {
  file = file.replace(
    `const [fontsLoaded, setFontsLoaded] = useState(false);`,
    `const [fontsLoaded, setFontsLoaded] = useState(false);\n  const { checkAuth } = useAuthStore();\n  const [isAuthChecked, setIsAuthChecked] = useState(false);`
  );
}

if (!file.includes('await checkAuth();')) {
    file = file.replace(
        `        if (isMounted) {
          setFontsLoaded(true);
        }`,
        `        if (isMounted) {
          await checkAuth();
          setFontsLoaded(true);
          setIsAuthChecked(true);
        }`
    );
}

if (!file.includes('!isAuthChecked')) {
    file = file.replace(
        `if (!fontsLoaded) {`,
        `if (!fontsLoaded || !isAuthChecked) {`
    );
}

if (!file.includes('<Toast />')) {
  file = file.replace(
    `  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );`,
    `  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
      <Toast />
    </SafeAreaProvider>
  );`
  );
}


fs.writeFileSync('App.tsx', file);
