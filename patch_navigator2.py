import re

with open('navigation/AppNavigator.tsx', 'r') as f:
    content = f.read()

import_screens = """
import Screen13 from '../screens/Screen13';
import Screen14 from '../screens/Screen14';
"""

content = content.replace("import Screen12 from '../screens/Screen12';", "import Screen12 from '../screens/Screen12';\n" + import_screens)

screens = """
          <Stack.Screen name="MobileIDE" component={Screen12} />
          <Stack.Screen name="CodeEditor" component={EditorScreenWrapper} />
          <Stack.Screen name="AIChatbot" component={Screen13} />
          <Stack.Screen name="AITutor" component={Screen14} />
"""

content = content.replace('          <Stack.Screen name="CodeEditor" component={EditorScreenWrapper} />', screens)
# there is a duplicate
content = content.replace("""          <Stack.Screen name="MobileIDE" component={Screen12} />
          <Stack.Screen name="CodeEditor" component={EditorScreenWrapper} />
          <Stack.Screen name="MobileIDE" component={Screen12} />""", """          <Stack.Screen name="MobileIDE" component={Screen12} />""")

with open('navigation/AppNavigator.tsx', 'w') as f:
    f.write(content)
