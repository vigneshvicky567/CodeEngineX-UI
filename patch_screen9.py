import re

with open('screens/Screen9.tsx', 'r') as f:
    content = f.read()

import_logic = """import { useState, useEffect } from 'react';
import { get } from '../lib/api';
"""
content = content.replace("import React from 'react';", "import React from 'react';\n" + import_logic)

state_logic = """
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAchievements() {
      try {
        const certData: any = await get('/api/v1/certificates');
        setCertificates(certData);
      } catch (e) {
        console.error('Failed to load certificates', e);
      } finally {
        setLoading(false);
      }
    }
    loadAchievements();
  }, []);
"""

content = re.sub(r'const navigation = useNavigation<any>\(\);', 'const navigation = useNavigation<any>();\n' + state_logic, content)

with open('screens/Screen9.tsx', 'w') as f:
    f.write(content)
