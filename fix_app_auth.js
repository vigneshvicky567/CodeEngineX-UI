const fs = require('fs');
let file = fs.readFileSync('App.tsx', 'utf8');
if (!file.includes('const { checkAuth } = useAuthStore();')) {
    file = file.replace(
      `const [fontsLoaded, setFontsLoaded] = useState(false);`,
      `const checkAuth = useAuthStore((state) => state.checkAuth);\n  const [isAuthChecked, setIsAuthChecked] = useState(false);\n  const [fontsLoaded, setFontsLoaded] = useState(false);`
    );
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
    file = file.replace(
        `if (!fontsLoaded) {`,
        `if (!fontsLoaded || !isAuthChecked) {`
    );
}

fs.writeFileSync('App.tsx', file);
