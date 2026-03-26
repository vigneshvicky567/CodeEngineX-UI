import re

with open('screens/Screen11.tsx', 'r') as f:
    content = f.read()

import_logic = """import { useState, useEffect } from 'react';
import { get } from '../lib/api';
import { useAuthStore } from '../store/authStore';
"""
content = content.replace("import React from 'react';", "import React from 'react';\n" + import_logic)

state_logic = """
  const [stats, setStats] = useState<any>(null);
  const [streakData, setStreakData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    async function loadStats() {
      try {
        if (user?.id) {
            const [statData, streak]: any = await Promise.all([
              get('/api/user/stats'),
              get(`/api/v1/streaks/${user.id}`)
            ]);
            setStats(statData);
            setStreakData(streak);
        }
      } catch (e) {
        console.error('Failed to load stats', e);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [user]);
"""

content = re.sub(r'const navigation = useNavigation<any>\(\);', 'const navigation = useNavigation<any>();\n' + state_logic, content)

with open('screens/Screen11.tsx', 'w') as f:
    f.write(content)
