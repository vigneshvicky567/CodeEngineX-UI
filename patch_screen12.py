import re

with open('screens/Screen12.tsx', 'r') as f:
    content = f.read()

import_logic = """import { useState, useEffect } from 'react';
import { get, post } from '../lib/api';
"""
content = content.replace("import React from 'react';", "import React from 'react';\n" + import_logic)

state_logic = """
  const [problemData, setProblemData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  useEffect(() => {
    async function loadProblem() {
      try {
        const id = '1'; // Replace with actual param
        const data = await get(`/api/v1/problems/${id}`);
        setProblemData(data);
      } catch (e) {
        console.error('Failed to load problem', e);
      } finally {
        setLoading(false);
      }
    }
    loadProblem();
  }, []);

  const handleRun = async (code: string, language: string) => {
    try {
      const res: any = await post('/api/v1/run', { source_code: code, language });
      return res; // Output
    } catch (e) {
      console.error('Failed to run code', e);
      return { stderr: 'Execution failed' };
    }
  };

  const handleSubmit = async (code: string, language: string) => {
    try {
      const res: any = await post('/api/v1/submit', { source_code: code, language });
      setSubmissionId(res.id);

      // Polling logic would go here
      const checkStatus = async () => {
         const statusRes: any = await get(`/api/v1/submissions/${res.id}`);
         if (statusRes.status.id <= 2) {
             setTimeout(checkStatus, 1000);
         } else {
             // Handle terminal status
             console.log(statusRes);
         }
      };
      setTimeout(checkStatus, 1000);
    } catch (e) {
      console.error('Failed to submit code', e);
    }
  };
"""

content = re.sub(r'const navigation = useNavigation<any>\(\);', 'const navigation = useNavigation<any>();\n' + state_logic, content)

with open('screens/Screen12.tsx', 'w') as f:
    f.write(content)
