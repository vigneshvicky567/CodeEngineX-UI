import re

with open('screens/Screen8.tsx', 'r') as f:
    content = f.read()

import_logic = """import { useState, useEffect } from 'react';
import { get, post } from '../lib/api';
import { useLessonStore } from '../store/lessonStore';
"""
content = content.replace("import React from 'react';", "import React from 'react';\n" + import_logic)

state_logic = """
  const [quizData, setQuizData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { setAttemptId, attemptId } = useLessonStore();
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  useEffect(() => {
    async function initAttempt() {
      try {
        const id = '1'; // Replace with actual param
        const data: any = await post(`/api/v1/grammar/assessments/${id}/attempts`);
        setAttemptId(data.id);
        setQuizData(data); // Assuming first question is returned
      } catch (e) {
        console.error('Failed to init attempt', e);
      } finally {
        setLoading(false);
      }
    }
    initAttempt();
  }, []);

  const handleCheck = async () => {
    try {
      if (selectedOptionId && attemptId) {
        const res: any = await post(`/api/v1/grammar/attempts/${attemptId}/answers`, {
          question_id: quizData?.question?.id || 'q1',
          selected_option_id: selectedOptionId
        });

        if (res.is_correct) {
          // set state to show correct feedback
        } else {
          // set state to show incorrect feedback
        }
      }
    } catch (e) {
      console.error('Failed to check answer', e);
    }
  };

  const handleContinue = async () => {
    try {
       if (attemptId) {
         await post(`/api/v1/grammar/attempts/${attemptId}/submit`);
       }
       navigation.navigate('LessonComplete');
    } catch (e) {
       console.error('Failed to submit attempt', e);
       navigation.navigate('LessonComplete');
    }
  };
"""

content = re.sub(r'const navigation = useNavigation<any>\(\);', 'const navigation = useNavigation<any>();\n' + state_logic, content)
content = content.replace("navigation.navigate('LessonComplete')", "handleContinue()")

with open('screens/Screen8.tsx', 'w') as f:
    f.write(content)
