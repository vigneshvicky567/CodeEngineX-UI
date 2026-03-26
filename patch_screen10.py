import re

with open('screens/Screen10.tsx', 'r') as f:
    content = f.read()

import_logic = """import { useState, useEffect } from 'react';
import { get, post } from '../lib/api';
import { useLessonStore } from '../store/lessonStore';
"""
content = content.replace("import React from 'react';", "import React from 'react';\n" + import_logic)

state_logic = """
  const [resultData, setResultData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { attemptId } = useLessonStore();

  useEffect(() => {
    async function loadResults() {
      try {
        if (attemptId) {
            const data = await get(`/api/v1/grammar/attempts/${attemptId}/results`);
            setResultData(data);
        }
        await post('/api/v1/streaks/activity', { type: 'lesson_complete' });
      } catch (e) {
        console.error('Failed to load results', e);
      } finally {
        setLoading(false);
      }
    }
    loadResults();
  }, [attemptId]);
"""

content = re.sub(r'const navigation = useNavigation<any>\(\);', 'const navigation = useNavigation<any>();\n' + state_logic, content)

with open('screens/Screen10.tsx', 'w') as f:
    f.write(content)
