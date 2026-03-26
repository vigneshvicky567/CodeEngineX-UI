const fs = require('fs');
let file = fs.readFileSync('navigation/AppNavigator.tsx', 'utf8');

if (!file.includes('Screen13')) {
    file = file.replace(
      `import Screen12 from '../screens/Screen12';`,
      `import Screen12 from '../screens/Screen12';\nimport Screen13 from '../screens/Screen13';\nimport Screen14 from '../screens/Screen14';`
    );

    file = file.replace(
      `<Stack.Screen name="MobileIDE" component={Screen12} />`,
      `<Stack.Screen name="MobileIDE" component={Screen12} />\n          <Stack.Screen name="AIChatbot" component={Screen13} />\n          <Stack.Screen name="AITutor" component={Screen14} />`
    );
}

fs.writeFileSync('navigation/AppNavigator.tsx', file);
