import re

with open('navigation/AppNavigator.tsx', 'r') as f:
    content = f.read()

# Add import statement
import_statement = "import { CodeEditorScreen } from '../src/editor-frontend/screens/CodeEditorScreen';\nimport { ThemeProvider } from '../src/editor-frontend/theme/ThemeContext';\nimport { SafeAreaView } from 'react-native-safe-area-context';\n"
if 'CodeEditorScreen' not in content:
    # Insert before the first import
    content = import_statement + content

# Wrap the screen component with ThemeProvider since the screen uses it
# Let's create a wrapper
wrapper_code = """
function EditorScreenWrapper() {
  return (
    <ThemeProvider>
      <CodeEditorScreen />
    </ThemeProvider>
  );
}
"""
if 'EditorScreenWrapper' not in content:
    # Add wrapper before AppNavigator export
    content = content.replace('export default function AppNavigator() {', wrapper_code + '\nexport default function AppNavigator() {')

# Add screen
screen_xml = '      <Stack.Screen name="CodeEditor" component={EditorScreenWrapper} />\n'
if 'name="CodeEditor"' not in content:
    content = content.replace('</Stack.Navigator>', screen_xml + '    </Stack.Navigator>')

with open('navigation/AppNavigator.tsx', 'w') as f:
    f.write(content)

print("Patch AppNavigator successful!")
