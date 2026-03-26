import re

with open('screens/Screen5.tsx', 'r') as f:
    content = f.read()

import_logic = """import { useState, useEffect } from 'react';
import { get } from '../lib/api';
"""
content = content.replace("import React from 'react';", "import React from 'react';\n" + import_logic)

state_logic = """
  const [lessonData, setLessonData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLesson() {
      try {
        const id = '1'; // Replace with actual param
        const data = await get(`/api/v1/grammar/assessments/${id}`);
        setLessonData(data);
      } catch (e) {
        console.error('Failed to load lesson', e);
      } finally {
        setLoading(false);
      }
    }
    loadLesson();
  }, []);
"""

content = re.sub(r'const navigation = useNavigation<any>\(\);', 'const navigation = useNavigation<any>();\n' + state_logic, content)

with open('screens/Screen5.tsx', 'w') as f:
    f.write(content)
