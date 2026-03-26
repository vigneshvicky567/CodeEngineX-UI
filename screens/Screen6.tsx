import React from 'react';
import { View, Text, Pressable, ScrollView, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import BottomNavBar, { TabItem } from '../components/BottomNavBar';

const NAV_TABS: TabItem[] = [
  { name: 'Learn', icon: 'school', route: 'Map' },
  { name: 'Explore', icon: 'explore', route: 'Explore' },
  { name: 'Shield', icon: 'verified-user' },
  { name: 'Progress', icon: 'person', route: 'Progress' },
];

export default function Screen6() {
  const navigation = useNavigation<any>();

  // BACKEND: GET /api/user/progress/map
  // Endpoint to fetch the user's current progress on the learning map.
  // Response: {
  //   stats: { gems: number, streak: number },
  //   nodes: Array<{ id: string, type: string, status: 'completed' | 'active' | 'locked', label: string }>
  // }
  /*
  useEffect(() => {
    // try {
    //   const data = await axios.get('/api/user/progress/map');
    //   setMapData(data);
    // } catch (e) { ... }
  }, []);
  */

  const handleStartLevel = () => {
    navigation.navigate('LessonIntro');
  };

  return (
    <SafeAreaView className="flex-1 bg-background pb-24">
      {/* TopAppBar */}
      <View className="w-full z-50 bg-white/90 flex-row justify-between items-center px-6 py-4 border-none">
        <View className="flex-row items-center gap-3">
          <View className="w-10 h-10 rounded-full bg-tertiary-container flex items-center justify-center overflow-hidden border-2 border-white">
            <Image
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEo3zD1b3eIFDkDwKkaSUpZwnFlFXIihp6zaKs1mSDudz9bN1LXnA061hWFMjFAJMKHMxL5yqK-NNwX4ctLNJO8xJkRvbGW_VhUyRX_msvq4-8m7i0RYcumovQAhhChwPLjbruzNBaRXz1KMcdOb5zXr-G95S52qDOO7tXa53aiRwyf-FXQLSezbXEpqal1_CzQVS2n970kFact9AiQMEIzkdHp4EKlwNC_j1k0Lut6AWdEl61XW_XD_YvAE_jC2GgrjBLT4zxVp4' }}
              className="w-full h-full"
            />
          </View>
          <Text className="text-[#1CB0F6] font-['Fredoka'] font-black italic text-2xl tracking-tight">CodeQuest</Text>
        </View>
        <View className="flex-row items-center gap-4">
          <View className="flex-row items-center gap-1 bg-surface-container-low px-3 py-1 rounded-full border-b-2 border-error-dim/20">
            <MaterialIcons name="favorite" size={20} color="#b31b25" />
            <Text className="font-headline font-bold text-error">5</Text>
          </View>
          <View className="flex-row items-center gap-1 bg-surface-container-low px-3 py-1 rounded-full border-b-2 border-tertiary-dim/20">
            <MaterialIcons name="local-fire-department" size={20} color="#edba00" />
            <Text className="font-headline font-bold text-tertiary-fixed-dim">12</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 w-full" contentContainerStyle={{ alignItems: 'center', paddingHorizontal: 16, paddingTop: 24, paddingBottom: 120 }}>
        {/* Unit Header Card */}
        <View className="w-full mb-12 transform -rotate-1">
          <View className="bg-primary p-6 rounded-lg relative overflow-hidden"
                style={{
                  shadowColor: '#00557a',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 1,
                  shadowRadius: 0,
                  elevation: 0,
                }}
          >
            <View className="absolute -right-4 -top-4 opacity-20 transform rotate-12">
              <MaterialIcons name="code" size={120} color="white" />
            </View>
            <Text className="font-headline text-white text-3xl font-bold mb-1">Unit 1: The Basics</Text>
            <Text className="text-on-primary/80 font-medium">Master the art of Variables and Loops</Text>
            <View className="mt-4 h-4 bg-primary-dim/30 rounded-full overflow-hidden border-2 border-primary-dim/20 flex-row">
              <View className="h-full w-1/3 bg-secondary-fixed rounded-full" />
            </View>
          </View>
        </View>

        {/* Vertical ZigZag Path */}
        <View className="relative w-full flex-col items-center gap-16 py-8">

          {/* SVG Path Line */}
          <View className="absolute inset-0 pointer-events-none opacity-20 items-center h-full w-full" style={{ zIndex: 0 }}>
             <Svg className="w-full h-[600px]" fill="none" viewBox="0 0 400 600">
              <Path d="M150 50 C 250 100, 300 150, 200 250 C 100 350, 150 400, 200 550" stroke="#00628c" strokeDasharray="20 20" strokeLinecap="round" strokeWidth="12" />
            </Svg>
          </View>

          {/* Path Node 1: Completed */}
          <View className="relative z-10 mr-24 mt-4">
            <Pressable className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center border-b-[8px] border-secondary-dim active:scale-95">
              <MaterialIcons name="check-circle" size={40} color="white" />
            </Pressable>
            <View className="absolute top-24 left-1/2 -ml-5 bg-white px-4 py-1 rounded-xl border-2 border-surface-container-highest">
              <Text className="font-label text-xs font-black uppercase text-secondary">Intro</Text>
            </View>
          </View>

          {/* Path Node 2: Completed */}
          <View className="relative z-10 ml-32">
            <Pressable className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center border-b-[8px] border-secondary-dim active:scale-95">
              <MaterialIcons name="terminal" size={40} color="white" />
            </Pressable>
            <View className="absolute top-24 left-1/2 -ml-8 bg-white px-4 py-1 rounded-xl border-2 border-surface-container-highest">
              <Text className="font-label text-xs font-black uppercase text-secondary">Strings</Text>
            </View>
          </View>

          {/* Path Node 3: ACTIVE */}
          <View className="relative z-20 my-4">
            <View className="absolute inset-0 bg-primary-container/40 rounded-full scale-150" />
            <Pressable
              onPress={handleStartLevel}
              className="w-24 h-24 bg-primary rounded-full flex items-center justify-center active:scale-95"
              style={{
                shadowColor: '#00557a',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 1,
                shadowRadius: 0,
                elevation: 0,
              }}
            >
              <MaterialIcons name="bolt" size={56} color="white" />
              {/* Character Speech Bubble */}
              <View className="absolute -top-16 left-20 bg-inverse-surface p-3 rounded-2xl rounded-bl-none shadow-xl w-40 transform rotate-3">
                <Text className="text-xs font-bold leading-tight text-white">Ready to tackle loops, Explorer?</Text>
              </View>
            </Pressable>
            <View className="absolute top-28 left-1/2 -ml-16 bg-primary px-6 py-2 rounded-xl border-b-4 border-primary-dim">
              <Text className="font-headline text-sm font-black text-white whitespace-nowrap">START LEVEL</Text>
            </View>
          </View>

          {/* Path Node 4: Locked */}
          <View className="relative z-10 mr-32 opacity-60 mt-4">
            <View className="w-20 h-20 bg-outline-variant rounded-full flex items-center justify-center border-b-[8px] border-[#90b0d3]">
              <MaterialIcons name="lock" size={40} color="#c5dfff" />
            </View>
          </View>

          {/* Path Node 5: Locked */}
          <View className="relative z-10 ml-20 opacity-60">
            <View className="w-20 h-20 bg-outline-variant rounded-full flex items-center justify-center border-b-[8px] border-[#90b0d3]">
              <MaterialIcons name="data-object" size={40} color="#c5dfff" />
            </View>
          </View>

          {/* Bonus Chest Card */}
          <View className="w-full mt-12 transform rotate-1">
            <View className="bg-tertiary-container p-6 rounded-lg border-b-[8px] border-tertiary-dim flex-row items-center gap-6">
              <View className="w-24 h-24 bg-white/40 rounded-2xl flex items-center justify-center overflow-hidden">
                <Image
                  source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCE-I8APbj5fRajaAokVRgl7buoMiiGVnfMOAFot7kkXA79GWjbJBr6z46A8jIdJ3mzR7srZm8hEcrLq8tl2Ap4EfZaY6FrX5T9iOF-xiYvH-bbwmkqiU6d5_flna0ZCGa6-9mrXkWAER3ZdohoRLchrcx-PYA-0RrAv9pOIw8yQu0oSoj0u93Ou-_xegukBhJF-EXEma8aZsh28UCRrwNVEdaQg9VrrRVVmXKFGZElxTbMGuh9uCU3ftZWVNeAdqPF0KjYr0yugjA' }}
                  className="w-16 h-16"
                  resizeMode="contain"
                />
              </View>
              <View className="flex-1">
                <Text className="font-headline text-on-tertiary-container text-2xl font-bold">Bonus Chest!</Text>
                <Text className="text-on-tertiary-fixed-variant font-medium mt-1 text-sm">Complete daily challenges to unlock epic rewards.</Text>
                <Pressable
                  className="mt-4 bg-white px-6 py-2 rounded-xl active:translate-y-1"
                  style={{
                    shadowColor: '#edba00',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 1,
                    shadowRadius: 0,
                    elevation: 0,
                  }}
                >
                  <Text className="font-headline font-black text-tertiary text-sm uppercase tracking-wider text-center">Claim Daily</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

                              {/* BottomNavBar */}
      <View className="absolute bottom-0 left-0 w-full z-50 flex-row justify-around items-center px-4 pb-6 pt-3 bg-white rounded-t-[2.5rem] border-t-4 border-[#d9eaff]">
        {/* Nav: Learn */}
        <Pressable
          onPress={() => navigation.navigate('Map')}
          className="flex-col items-center justify-center px-5 py-2 bg-[#d9eaff] rounded-2xl transform scale-110"
        >
          <MaterialIcons name="school" size={24} color="#1CB0F6" />
          <Text className="font-label font-bold text-[11px] uppercase tracking-wider mt-1 text-[#1CB0F6]">Learn</Text>
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
          className="flex-col items-center justify-center px-5 py-2 active:scale-95"
        >
          <MaterialIcons name="military-tech" size={24} color="#94a3b8" />
          <Text className="font-label font-bold text-[11px] uppercase tracking-wider mt-1 text-slate-400">Badges</Text>
        </Pressable>
        {/* Nav: Profile */}
        <Pressable
          onPress={() => navigation.navigate('Progress')}
          className="flex-col items-center justify-center px-5 py-2 active:scale-95"
        >
          <MaterialIcons name="person" size={24} color="#94a3b8" />
          <Text className={`font-label font-bold text-[11px] uppercase tracking-wider mt-1 text-slate-400`}>Profile</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
