import re

with open('screens/Screen6.tsx', 'r') as f:
    content = f.read()

import_logic = """import { useState, useEffect } from 'react';
import { get, post } from '../lib/api';
import { useProgressStore } from '../store/progressStore';
import { useAuthStore } from '../store/authStore';
"""
content = content.replace("import React from 'react';", "import React from 'react';\n" + import_logic)

state_logic = """
  const [mapData, setMapData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { setNodes, setStreak, setGems, streak, gems } = useProgressStore();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    async function loadData() {
      try {
        const data: any = await get('/api/user/progress/map');
        setMapData(data);
        setNodes(data.nodes || {});
        setStreak(data.stats?.streak || 0);
        setGems(data.stats?.gems || 0);
      } catch (e) {
        console.error('Failed to load map data', e);
      }

      try {
        if (user?.id) {
            const streakData: any = await get(`/api/v1/streaks/${user.id}`);
            setStreak(streakData.current_streak || 0);
        }
      } catch (e) {
          console.error('Failed to load streak', e);
      }

      setLoading(false);
    }
    loadData();
  }, [user]);

  const handleNodePress = (status: string) => {
    if (status === 'locked') {
      // Should show toast: Complete previous lessons first
      return;
    }
    navigation.navigate('LessonIntro', { lessonId: '1', assessmentId: '1' });
  };
"""

content = re.sub(r'export default function Screen6\(\) \{.*?(?=  // BACKEND:)', 'export default function Screen6() {\n  const navigation = useNavigation<any>();\n' + state_logic + '\n', content, flags=re.DOTALL)

# Add AI Tutor Floating Action Button
fab_code = """
      <Pressable
        className="absolute bottom-24 right-4 bg-primary rounded-full p-4 shadow-lg flex-row items-center justify-center border-b-4 border-primary-dark active:translate-y-1 active:border-b-0"
        onPress={() => navigation.navigate('AITutor')}
      >
        <MaterialIcons name="auto-awesome" size={28} color="#FFF" />
      </Pressable>
"""

content = content.replace('      <BottomNavBar tabs={NAV_TABS} activeTab="Learn" onTabPress={(route) => navigation.navigate(route)} />', fab_code + '\n      <BottomNavBar tabs={NAV_TABS} activeTab="Learn" onTabPress={(route) => navigation.navigate(route)} />')

# replace header streak and gems
content = content.replace('          <Text className="text-[#FF9600] font-bold text-lg">12</Text>', '          <Text className="text-[#FF9600] font-bold text-lg">{streak}</Text>')
content = content.replace('          <Text className="text-[#1CB0F6] font-bold text-lg ml-1">450</Text>', '          <Text className="text-[#1CB0F6] font-bold text-lg ml-1">{gems}</Text>')

# Replace hardcoded navigation
content = content.replace("onPress={() => navigation.navigate('LessonIntro')}", "onPress={() => handleNodePress('active')}")

with open('screens/Screen6.tsx', 'w') as f:
    f.write(content)
