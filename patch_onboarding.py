import re

def patch_screen(filename, endpoint, payload_key):
    with open(filename, 'r') as f:
        content = f.read()

    import_logic = "import { post } from '../lib/api';\n"
    if 'import { post }' not in content:
        content = content.replace("import { useNavigation } from '@react-navigation/native';", "import { useNavigation } from '@react-navigation/native';\n" + import_logic)

    if filename == 'screens/Screen1.tsx':
        replacement = f"""  const handleContinue = async () => {{
    if (selectedPath) {{
      try {{ await post('{endpoint}', {{ {payload_key}: selectedPath }}); }} catch (e) {{ console.log(e); }}
      navigation.navigate('ExperienceLevel');
    }}
  }};"""
    elif filename == 'screens/Screen2.tsx':
        replacement = f"""  const handleContinue = async () => {{
    if (selectedLevel) {{
      try {{ await post('{endpoint}', {{ {payload_key}: selectedLevel }}); }} catch (e) {{ console.log(e); }}
      navigation.navigate('GoalSetting');
    }}
  }};"""
    elif filename == 'screens/Screen3.tsx':
        replacement = f"""  const handleContinue = async () => {{
    if (selectedGoal) {{
      try {{ await post('{endpoint}', {{ {payload_key}: selectedGoal }}); }} catch (e) {{ console.log(e); }}
      navigation.navigate('MainTabs');
    }}
  }};"""

    content = re.sub(r'const handleContinue = \(\) => \{.*?(?=  return \()', replacement + '\n\n', content, flags=re.DOTALL)

    with open(filename, 'w') as f:
        f.write(content)

patch_screen('screens/Screen1.tsx', '/api/user/path', 'path')
patch_screen('screens/Screen2.tsx', '/api/user/experience', 'experience')
patch_screen('screens/Screen3.tsx', '/api/user/goal', 'goal')
