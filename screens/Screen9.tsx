import React from 'react';
import { View, Text, Pressable, ScrollView, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNavBar, { TabItem } from '../components/BottomNavBar';

const NAV_TABS: TabItem[] = [
  { name: 'Learn', icon: 'school', route: 'Map' },
  { name: 'Leaderboard', icon: 'leaderboard' },
  { name: 'Badges', icon: 'military-tech', route: 'Achievements' },
  { name: 'Profile', icon: 'person', route: 'Progress' },
];

export default function Screen9() {
  const navigation = useNavigation<any>();

  // BACKEND: GET /api/user/achievements
  // Endpoint to fetch earned badges, recent activity, and milestones.
  // Response: {
  //   level: number,
  //   badges: { earned: Array<{ id: string, name: string, icon: string }>, total: number },
  //   recentActivity: Array<{ id: string, title: string, time: string, type: string }>,
  //   milestones: { streak: number, linesCoded: number, firstProject: boolean },
  //   featuredAchievement: { title: string, desc: string, image: string }
  // }
  /*
  useEffect(() => {
    // try {
    //   const data = await axios.get('/api/user/achievements');
    //   setAchievementsData(data);
    // } catch (e) { ... }
  }, []);
  */

  return (
    <SafeAreaView className="flex-1 bg-surface pb-24">
      {/* TopAppBar */}
      <View className="bg-white/90 z-50 shadow-[0_4px_0_0_rgba(28,176,246,0.2)]">
        <View className="flex-row justify-between items-center px-6 py-4 w-full">
          <View className="flex-row items-center gap-3">
            <Pressable className="p-2 rounded-xl active:translate-y-1">
              <MaterialIcons name="menu" size={24} color="#64748b" />
            </Pressable>
            <Text className="text-[#1CB0F6] font-['Fredoka'] font-bold text-2xl tracking-tight">CodeLego</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <View className="bg-surface-container px-4 py-2 rounded-full border-b-4 border-surface-container-highest flex-row items-center gap-1">
              <Text className="text-[#1CB0F6] font-bold text-sm">5 🔥 100</Text>
              <MaterialIcons name="favorite" size={14} color="#ef4444" />
            </View>
          </View>
        </View>
        <View className="bg-slate-100 h-[2px] w-full" />
      </View>

      <ScrollView className="pt-6 px-6 max-w-4xl mx-auto w-full">
        {/* Header Section */}
        <View className="flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <View>
            <Text className="font-['Fredoka'] text-4xl font-bold text-primary tracking-tight">Achievements</Text>
            <Text className="font-body text-on-surface-variant mt-1">Showcase your coding mastery and milestones.</Text>
          </View>
          <View className="flex-row gap-2">
            <View className="bg-tertiary-container text-on-tertiary-container px-4 py-2 rounded-xl border-b-4 border-tertiary-dim flex-row items-center gap-2">
              <MaterialIcons name="workspace-premium" size={20} color="#574300" />
              <Text className="font-bold text-on-tertiary-container">Level 12</Text>
            </View>
          </View>
        </View>

        {/* Bento Grid Layout for Achievements */}
        <View className="flex-col md:flex-row gap-6 mb-8">

          {/* Section 1: Badges Earned */}
          <View className="md:w-2/3 space-y-4 gap-4">
            <View className="flex-row items-center justify-between px-2">
              <Text className="font-label font-extrabold text-xl uppercase tracking-wider text-on-surface">Badges Earned</Text>
              <Text className="font-body text-sm font-bold text-primary">12/24</Text>
            </View>

            <View className="bg-surface-container-low p-6 rounded-lg flex-row flex-wrap gap-6 relative overflow-hidden" style={{ shadowColor: '#cfe5ff', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 1, shadowRadius: 0 }}>
              <View className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full" />

              {/* Earned Badge 1 */}
              <Pressable className="flex-col items-center gap-2 w-[70px] active:translate-y-1">
                <View className="w-16 h-16 bg-secondary-container rounded-full flex items-center justify-center border-b-4 border-secondary-dim shadow-lg">
                  <MaterialIcons name="terminal" size={32} color="#245c00" />
                </View>
                <Text className="font-body text-[10px] font-bold text-center">Hello World</Text>
              </Pressable>

              {/* Earned Badge 2 */}
              <Pressable className="flex-col items-center gap-2 w-[70px] active:translate-y-1">
                <View className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center border-b-4 border-primary-dim shadow-lg">
                  <MaterialIcons name="bolt" size={32} color="#00324a" />
                </View>
                <Text className="font-body text-[10px] font-bold text-center">Speed Coder</Text>
              </Pressable>

              {/* Earned Badge 3 */}
              <Pressable className="flex-col items-center gap-2 w-[70px] active:translate-y-1">
                <View className="w-16 h-16 bg-tertiary-container rounded-full flex items-center justify-center border-b-4 border-tertiary-dim shadow-lg">
                  <MaterialIcons name="local-fire-department" size={32} color="#574300" />
                </View>
                <Text className="font-body text-[10px] font-bold text-center">Hot Streak</Text>
              </Pressable>

              {/* Earned Badge 4 */}
              <Pressable className="flex-col items-center gap-2 w-[70px] active:translate-y-1">
                <View className="w-16 h-16 bg-secondary-container rounded-full flex items-center justify-center border-b-4 border-secondary-dim shadow-lg">
                  <MaterialIcons name="bug-report" size={32} color="#245c00" />
                </View>
                <Text className="font-body text-[10px] font-bold text-center">Bug Squasher</Text>
              </Pressable>

              {/* Locked Badges */}
              {[
                { icon: 'database', title: 'Data Master' },
                { icon: 'security', title: 'Guardian' },
                { icon: 'hub', title: 'Architect' },
                { icon: 'rocket-launch', title: 'Innovator' }
              ].map((badge) => (
                <View key={badge.title} className="flex-col items-center gap-2 w-[70px] opacity-50">
                  <View className="w-16 h-16 bg-surface-container-highest rounded-full flex items-center justify-center border-b-4 border-outline-variant relative">
                    <MaterialIcons name={badge.icon as any} size={32} color="#5a7a9a" />
                    <View className="absolute -top-1 -right-1 bg-on-surface rounded-full p-1 border-2 border-white">
                      <MaterialIcons name="lock" size={10} color="white" />
                    </View>
                  </View>
                  <Text className="font-body text-[10px] font-bold text-center">{badge.title}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Section 3: Recent Activity */}
          <View className="md:w-1/3 space-y-4 mt-8 md:mt-0 gap-4">
            <Text className="font-label font-extrabold text-xl uppercase tracking-wider text-on-surface px-2">Recent Activity</Text>
            <View className="bg-white p-6 rounded-lg border-l-4 border-primary gap-6" style={{ shadowColor: '#d9eaff', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 1, shadowRadius: 0 }}>

              <View className="flex-row gap-4 items-start">
                <View className="bg-secondary-container p-2 rounded-lg">
                  <MaterialIcons name="check-circle" size={16} color="#245c00" />
                </View>
                <View>
                  <Text className="font-body text-sm font-bold">Solved "Array Sorting"</Text>
                  <Text className="font-body text-[10px] text-on-surface-variant">2 hours ago</Text>
                </View>
              </View>

              <View className="flex-row gap-4 items-start">
                <View className="bg-tertiary-container p-2 rounded-lg">
                  <MaterialIcons name="stars" size={16} color="#574300" />
                </View>
                <View>
                  <Text className="font-body text-sm font-bold">Reached 1,000 Lines</Text>
                  <Text className="font-body text-[10px] text-on-surface-variant">Yesterday</Text>
                </View>
              </View>

              <View className="flex-row gap-4 items-start">
                <View className="bg-primary-container p-2 rounded-lg">
                  <MaterialIcons name="group" size={16} color="#00324a" />
                </View>
                <View>
                  <Text className="font-body text-sm font-bold">First Peer Review</Text>
                  <Text className="font-body text-[10px] text-on-surface-variant">3 days ago</Text>
                </View>
              </View>

              <Pressable className="w-full py-2 bg-surface-container rounded-xl border-b-4 border-surface-container-highest active:translate-y-1">
                <Text className="text-primary font-body text-xs font-bold text-center">View Full History</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Section 2: Milestones */}
        <View className="space-y-4 pt-4 gap-4 mb-8">
          <Text className="font-label font-extrabold text-xl uppercase tracking-wider text-on-surface px-2">Milestones</Text>
          <View className="flex-col md:flex-row gap-4 flex-wrap">

            <View className="w-full md:w-[48%] bg-surface-container-lowest p-6 rounded-lg border-2 border-surface-container flex-row gap-6 items-center" style={{ shadowColor: '#d9eaff', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 1, shadowRadius: 0 }}>
              <View className="bg-tertiary-container/20 p-4 rounded-2xl">
                <MaterialIcons name="calendar-today" size={36} color="#725800" />
              </View>
              <View className="flex-1 space-y-2 gap-2">
                <View className="flex-row justify-between items-end">
                  <Text className="font-['Fredoka'] font-bold text-lg">7 Day Streak</Text>
                  <Text className="font-body text-xs font-bold text-tertiary">5/7 days</Text>
                </View>
                <View className="h-3 bg-surface-container rounded-full overflow-hidden flex-row">
                  <View className="h-full w-[71%] bg-tertiary rounded-full" />
                </View>
              </View>
            </View>

            <View className="w-full md:w-[48%] bg-surface-container-lowest p-6 rounded-lg border-2 border-surface-container flex-row gap-6 items-center" style={{ shadowColor: '#d9eaff', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 1, shadowRadius: 0 }}>
              <View className="bg-primary-container/20 p-4 rounded-2xl">
                <MaterialIcons name="code" size={36} color="#00628c" />
              </View>
              <View className="flex-1 space-y-2 gap-2">
                <View className="flex-row justify-between items-end">
                  <Text className="font-['Fredoka'] font-bold text-lg">1,000 Lines Written</Text>
                  <Text className="font-body text-xs font-bold text-primary">1,240/2,500</Text>
                </View>
                <View className="h-3 bg-surface-container rounded-full overflow-hidden flex-row">
                  <View className="h-full w-[49%] bg-primary rounded-full" />
                </View>
              </View>
            </View>

            <View className="w-full md:w-[48%] bg-secondary-container/10 p-6 rounded-lg border-2 border-secondary-container flex-row gap-6 items-center relative overflow-hidden" style={{ shadowColor: '#84fb42', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 1, shadowRadius: 0 }}>
              <View className="bg-secondary-container p-4 rounded-2xl z-10">
                <MaterialIcons name="emoji-events" size={36} color="#245c00" />
              </View>
              <View className="flex-1 space-y-2 z-10 gap-2">
                <View className="flex-row justify-between items-end">
                  <Text className="font-['Fredoka'] font-bold text-lg">First Project</Text>
                  <Text className="font-body text-xs font-bold text-secondary">COMPLETED!</Text>
                </View>
                <View className="h-3 bg-secondary-container rounded-full overflow-hidden flex-row">
                  <View className="h-full w-full bg-secondary rounded-full" />
                </View>
              </View>
              <View className="absolute -right-4 -top-4 opacity-10 rotate-12">
                <MaterialIcons name="celebration" size={96} color="black" />
              </View>
            </View>

          </View>
        </View>

        {/* Featured Achievement Hero Card */}
        <View className="mt-8 mb-32">
          <View className="relative bg-inverse-surface p-8 rounded-lg overflow-hidden" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.25, shadowRadius: 10 }}>
            <View className="relative z-10 flex-col md:flex-row items-center gap-8">
              <View className="w-32 h-32 md:w-40 md:h-40 bg-primary-fixed rounded-xl flex items-center justify-center border-b-[8px] border-primary-dim rotate-3 shadow-2xl">
                <Image
                  source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1Eo3h95KwEmpF11vSZj8ODdPDJhqPjuEilCLuNIFQN2vuSvtIf1vejy1CCCl9UEnvWw_-ZDEw3I_TMreFdTRDVeijCXcfJTPVUX-JzPLP1KzIDyHW30t7uun5tinx_wVdkybQdglIMsYT5v5kJj6pu8G98K61BUk2XtSGEwbd14KCMQiU6dZEYBuJ1wJA5FXGkIhxHmbf7Y9Vy74lF9k4GevJd7odkv9t21MwVwRwAPHEbgO6TIbYUVTCz0394D6xSywsWTrweQQ' }}
                  className="w-20 h-20"
                />
              </View>
              <View className="items-center md:items-start flex-1 mt-4 md:mt-0">
                <View className="bg-primary/20 px-3 py-1 rounded-full self-center md:self-start">
                    <Text className="text-primary-fixed text-xs font-bold uppercase tracking-widest font-body">Ultra Rare</Text>
                </View>
                <Text className="font-['Fredoka'] text-3xl font-bold text-white mt-2 text-center md:text-left">Code King of the Month</Text>
                <Text className="font-body text-surface-container-highest mt-3 text-center md:text-left">You maintained the top spot on the global leaderboard for 30 consecutive days. This is a legendary feat achieved by only 0.1% of builders.</Text>
                <Pressable className="mt-6 px-8 py-3 bg-primary-fixed rounded-xl border-b-4 border-primary-dim active:translate-y-1">
                  <Text className="text-on-primary-fixed font-['Fredoka'] font-bold text-center">Share Achievement</Text>
                </Pressable>
              </View>
            </View>
            {/* Abstract coding background deco */}
            <View className="absolute top-0 right-0 p-4 opacity-10">
              <Text className="font-code text-primary text-xs">
                {`while(achieved) {\n  celebrate();\n  levelUp();\n  continueBuild();\n}`}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

                  {/* BottomNavBar */}
      <View className="absolute bottom-0 left-0 w-full z-50 flex-row justify-around items-center px-4 pb-6 pt-3 bg-white rounded-t-[2.5rem] border-t-4 border-[#d9eaff]">
        {/* Nav: Learn */}
        <Pressable
          onPress={() => navigation.navigate('Map')}
          className="flex-col items-center justify-center px-5 py-2 active:scale-95"
        >
          <MaterialIcons name="school" size={24} color="#94a3b8" />
          <Text className="font-label font-bold text-[11px] uppercase tracking-wider mt-1 text-slate-400">Learn</Text>
        </Pressable>
        {/* Nav: Explore */}
        <Pressable
          onPress={() => navigation.navigate('Explore')}
          className="flex-col items-center justify-center px-5 py-2 active:scale-95"
        >
          <MaterialIcons name="explore" size={24} color="#94a3b8" />
          <Text className="font-label font-bold text-[11px] uppercase tracking-wider mt-1 text-slate-400">Explore</Text>
        </Pressable>
        {/* Nav: Badges */}
        <Pressable
          onPress={() => navigation.navigate('Achievements')}
          className="flex-col items-center justify-center px-5 py-2 bg-[#d9eaff] rounded-2xl transform scale-110"
        >
          <MaterialIcons name="military-tech" size={24} color="#1CB0F6" />
          <Text className="font-label font-bold text-[11px] uppercase tracking-wider mt-1 text-[#1CB0F6]">Badges</Text>
        </Pressable>
        {/* Nav: Profile */}
        <Pressable
          onPress={() => navigation.navigate('Progress')}
          className="flex-col items-center justify-center px-5 py-2 active:scale-95"
        >
          <MaterialIcons name="person" size={24} color="#94a3b8" />
          <Text className="font-label font-bold text-[11px] uppercase tracking-wider mt-1 text-slate-400">Profile</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
