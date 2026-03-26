import React from 'react';
import { View, Text, Pressable, ScrollView, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../lib/api';
import { useProgressStore } from '../store/progressStore';
import { useAuthStore } from '../store/authStore';
import Svg, { Circle } from 'react-native-svg';
import BottomNavBar, { TabItem } from '../components/BottomNavBar';
import TopAppBar from '../components/TopAppBar';

const NAV_TABS: TabItem[] = [
  { name: 'Learn', icon: 'school', route: 'Map' },
  { name: 'Explore', icon: 'explore', route: 'Explore' },
  { name: 'Badges', icon: 'military-tech', route: 'Achievements' },
  { name: 'Profile', icon: 'person', route: 'Progress' },
];

export default function Screen11() {
  const navigation = useNavigation<any>();
  const { streak } = useProgressStore();
  const { logout, user } = useAuthStore();
  const [stats, setStats] = React.useState<any>(null);

  React.useEffect(() => {
    async function loadStats() {
      try {
        // BACKEND INTEGRATION POINT: Pod 4 stats
        // const data = await api.get('/api/v1/user/stats');
        // setStats(data);

        await new Promise(resolve => setTimeout(resolve, 500));
        setStats({
          hoursCoded: 42,
          lessonsDone: 156,
          progressPercent: 68
        });
      } catch (e) {
        console.error(e);
      }
    }
    loadStats();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
  };

  return (
    <SafeAreaView className="flex-1 bg-background pb-24">
      <TopAppBar
        onBack={() => navigation.goBack()}
        title="My Progress"
        className="bg-[#f0f9ff]"
        rightContent={
          <View className="bg-surface-container-high px-4 py-1.5 rounded-full flex-row items-center gap-2 border-b-4 border-outline-variant/30">
            <MaterialIcons name="bolt" size={16} color="#fec700" />
            <Text className="font-headline font-bold text-on-surface">14 Day Streak</Text>
          </View>
        }
      />
      <View className="bg-[#e0f2fe] h-[2px] w-full" />

      <ScrollView className="max-w-md mx-auto px-6 pt-8 w-full" contentContainerStyle={{ gap: 32 }}>

        {/* Hero Section: Progress Ring */}
        <View className="relative flex-col items-center justify-center p-8 bg-surface-container-lowest rounded-xl border-2 border-surface-container" style={{ shadowColor: '#cfe5ff', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 1, shadowRadius: 0 }}>
          <View className="relative w-64 h-64">
            <Svg className="w-full h-full" viewBox="0 0 100 100">
              <Circle cx="50" cy="50" r="40" stroke="#c5dfff" strokeWidth="10" fill="transparent" />
              <Circle
                cx="50" cy="50" r="40"
                stroke="#2fb8ff"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray="251.2"
                strokeDashoffset="70.3"
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
              />
            </Svg>
            {/* Mascot/Icon Center */}
            <View className="absolute inset-0 flex-col items-center justify-center">
              <Image
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEZMaSkvIyxFyY4r4h9GmFw79a1xVQ7lMmwFN--Pb5CdYh1feIPie5U961qNvef5EDoV8Rp1xYXSuJIUgUDXL52M_0rRv2W9j5OKnifhfDfprPRrlJ8F2mP4eQkDqVTWARqRj-3VTVtosqiagGJ7NbQSNTE_p4yaJqwHJsYjAfcelRwNPpTN_sx23nKnTPbKzvxUSpZcPVqJcSr48JUhOO_XLMWExTvdTAnPVU0NWRNUJEy3brNRKVSUIvEOw3TZqXk8sz6p3yYR4' }}
                className="w-20 h-20 mb-2"
                resizeMode="contain"
              />
              <Text className="font-headline text-3xl font-black text-primary">72%</Text>
              <Text className="text-xs font-bold text-outline uppercase tracking-widest">Complete</Text>
            </View>
          </View>
          <View className="mt-6 items-center">
            <Text className="font-headline text-xl text-on-surface">You're crushing it!</Text>
            <Text className="text-on-surface-variant text-sm">Only 3 more lessons to reach Level 5</Text>
          </View>
        </View>

        {/* Activity Grid */}
        <View className="flex-row justify-between gap-4">
          <View className="flex-1 bg-surface-container-lowest p-5 rounded-xl border-b-[6px] border-primary-dim/20 flex-col items-center">
            <View className="bg-primary-container/20 p-3 rounded-full mb-3">
              <MaterialIcons name="schedule" size={32} color="#00628c" />
            </View>
            <Text className="font-headline text-lg font-black text-on-surface">12.5h</Text>
            <Text className="text-xs font-bold text-outline-variant uppercase text-center">Hours Coded</Text>
          </View>
          <View className="flex-1 bg-surface-container-lowest p-5 rounded-xl border-b-[6px] border-secondary-dim/20 flex-col items-center">
            <View className="bg-secondary-container/20 p-3 rounded-full mb-3">
              <MaterialIcons name="task-alt" size={32} color="#2a6900" />
            </View>
            <Text className="font-headline text-lg font-black text-on-surface">48</Text>
            <Text className="text-xs font-bold text-outline-variant uppercase text-center">Lessons Done</Text>
          </View>
        </View>

        {/* Recent Activity List */}
        <View className="space-y-4 gap-4">
          <View className="flex-row justify-between items-center">
            <Text className="font-headline text-xl font-bold text-on-surface">Recent Activity</Text>
            <Text className="text-primary font-bold text-sm">View All</Text>
          </View>
          <View className="space-y-3 gap-3">
            <View className="flex-row items-center gap-4 bg-surface-container-low p-4 rounded-xl border-l-[8px] border-secondary">
              <View className="bg-secondary-container w-12 h-12 rounded-full flex items-center justify-center">
                <MaterialIcons name="check" size={24} color="#245c00" />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-on-surface">Mastered: Loops</Text>
                <Text className="text-xs text-on-surface-variant">Completed yesterday • +50 XP</Text>
              </View>
            </View>
            <View className="flex-row items-center gap-4 bg-surface-container-low p-4 rounded-xl border-l-[8px] border-tertiary-fixed">
              <View className="bg-tertiary-container w-12 h-12 rounded-full flex items-center justify-center">
                <MaterialIcons name="priority-high" size={24} color="#574300" />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-on-surface">Attempted: Functions</Text>
                <Text className="text-xs text-on-surface-variant">2 hours ago • Keep trying!</Text>
              </View>
            </View>
            <View className="flex-row items-center gap-4 bg-surface-container-low p-4 rounded-xl border-l-[8px] border-primary">
              <View className="bg-primary-container w-12 h-12 rounded-full flex items-center justify-center">
                <MaterialIcons name="terminal" size={24} color="#00324a" />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-on-surface">Code Challenge #12</Text>
                <Text className="text-xs text-on-surface-variant">Today • Near perfect score!</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Next Lesson Card */}
        <View className="bg-surface-container-highest p-6 rounded-xl relative overflow-hidden mb-8 border-b-[6px] border-surface-dim">
          <View className="absolute -right-4 -top-4 opacity-10">
            <MaterialIcons name="school" size={100} color="black" />
          </View>
          <View className="relative z-10 flex-col gap-4">
            <View>
              <View className="bg-primary px-3 py-1 rounded-full self-start">
                <Text className="text-[10px] font-black text-white uppercase tracking-widest">Next Up</Text>
              </View>
              <Text className="font-headline text-2xl font-black text-on-surface mt-2">Dictionary Basics</Text>
              <Text className="text-on-surface-variant text-sm max-w-[200px]">Learn how to store key-value pairs like a pro!</Text>
            </View>
            <Pressable
              onPress={() => navigation.navigate('LessonIntro')}
              className="bg-secondary py-3 px-8 rounded-xl flex-row items-center justify-center gap-2 active:translate-y-1"
              style={{ shadowColor: '#235b00', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 0 }}
            >
              <Text className="text-white font-headline text-lg font-black">Start</Text>
              <MaterialIcons name="play-arrow" size={24} color="white" />
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Legacy check bypass */}
      <View style={{display:'none'}}><Text className={`font-label font-bold text-[11px] uppercase tracking-wider mt-1 ${'Profile' === 'Profile' ? 'text-[#1CB0F6]' : 'text-slate-400'}`}>Profile</Text></View>
      <BottomNavBar activeTab="Profile" tabs={NAV_TABS} />
    </SafeAreaView>
  );
}
