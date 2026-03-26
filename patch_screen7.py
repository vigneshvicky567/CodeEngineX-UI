import re

with open('screens/Screen7.tsx', 'r') as f:
    content = f.read()

import_logic = """import { useState, useEffect } from 'react';
import { get, post } from '../lib/api';
"""
content = content.replace("import React from 'react';", "import React from 'react';\n" + import_logic)

state_logic = """
  const [courses, setCourses] = useState<any[]>([]);
  const [problems, setProblems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadExploreData() {
      try {
        const [courseData, problemData]: any = await Promise.all([
          get('/api/v1/grammar/assessments'),
          get('/api/v1/problems')
        ]);
        setCourses(courseData);
        setProblems(problemData);
      } catch (e) {
        console.error('Failed to load explore data', e);
      } finally {
        setLoading(false);
      }
    }
    loadExploreData();
  }, []);

  const handleGenerateQuiz = async () => {
    try {
      const topic = 'Python Basics'; // from state/modal
      const res: any = await post('/api/v1/quiz/generate', { topic });
      navigation.navigate('LessonQuiz', { quizId: res.id });
    } catch (e) {
      console.error('Failed to generate quiz', e);
    }
  };
"""

content = re.sub(r'const navigation = useNavigation<any>\(\);', 'const navigation = useNavigation<any>();\n' + state_logic, content)

with open('screens/Screen7.tsx', 'w') as f:
    f.write(content)
