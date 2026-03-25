import React from 'react';
import { View, Text, Pressable, ScrollView, Image, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Screen7() {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView className="flex-1 bg-surface pb-24">
      {/* TopAppBar */}
      <View className="w-full z-50 bg-white/90 flex-row justify-between items-center px-6 py-4 border-none">
        <View className="flex-row items-center gap-3">
          <View className="w-10 h-10 rounded-full bg-tertiary-container flex items-center justify-center overflow-hidden border-2 border-white">
            <Image
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2iM6cW64g1yLOSd-faFA37R_rQmSaHJdYlFJqhMFTIMt2jcIVs-O98h-5Rh00abE3oqpCYiwZIzooukNd2ddNPgxkEPmqGRVQrYfKUdoFPo1P9s7TUz6loAUZAoiNZ9IJgpQ78I8PZbYRKFl_qfKTfGazt7lVmKm1SFzjLoZZ3fbPcutfBIJ_u_QMYgNqilwEuMMCJIsV1zTv8hyRNI0pahVe5O0BChXmDBMZQUBjr7LHnagttkWTyB-TpERLj_5yKQ1UlTP80ww' }}
              className="w-full h-full"
            />
          </View>
          <Text className="text-[#1CB0F6] font-['Fredoka'] font-bold text-2xl tracking-tight italic">CodeQuest</Text>
        </View>
        <Pressable className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container-high active:translate-y-1">
          <MaterialIcons name="bolt" size={24} color="#1CB0F6" />
        </Pressable>
      </View>

      <ScrollView className="flex-1 w-full px-6 pt-6 pb-32">
        {/* Search & Filter Section */}
        <View className="mb-8">
          <View className="relative flex-row items-center bg-surface-container-low rounded-2xl border-2 border-transparent px-4 py-3"
                style={{ shadowColor: '#d9eaff', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 0 }}
          >
            <MaterialIcons name="search" size={24} color="#5a7a9a" />
            <TextInput
              placeholder="Search for a language..."
              className="flex-1 ml-3 font-headline text-lg"
              placeholderTextColor="#5a7a9a80"
            />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-6 flex-row" contentContainerStyle={{ paddingBottom: 8, gap: 12 }}>
            <View className="px-5 py-2 bg-primary-container rounded-full justify-center">
              <Text className="text-on-primary-container font-label font-bold text-xs uppercase tracking-wider">All Languages</Text>
            </View>
            <Pressable className="px-5 py-2 bg-surface-container rounded-full justify-center">
              <Text className="text-on-surface-variant font-label font-bold text-xs uppercase tracking-wider">Frontend</Text>
            </Pressable>
            <Pressable className="px-5 py-2 bg-surface-container rounded-full justify-center">
              <Text className="text-on-surface-variant font-label font-bold text-xs uppercase tracking-wider">Backend</Text>
            </Pressable>
            <Pressable className="px-5 py-2 bg-surface-container rounded-full justify-center">
              <Text className="text-on-surface-variant font-label font-bold text-xs uppercase tracking-wider">Data Science</Text>
            </Pressable>
          </ScrollView>
        </View>

        {/* Course Bento Grid */}
        <View className="flex-col gap-6 mb-8">
          {/* JavaScript Card */}
          <View className="bg-surface-container-lowest rounded-lg p-6 flex-col relative overflow-hidden">
            <View className="absolute top-0 right-0 w-32 h-32 bg-yellow-100 rounded-bl-full -mr-10 -mt-10 opacity-50" />
            <View className="mb-4 w-16 h-16 bg-tertiary-container rounded-2xl flex items-center justify-center" style={{ shadowColor: '#edba00', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 0 }}>
              <MaterialIcons name="javascript" size={40} color="#574300" />
            </View>
            <Text className="font-headline text-2xl font-bold mb-2 text-on-surface">JavaScript</Text>
            <Text className="text-on-surface-variant text-sm mb-6 leading-relaxed">Master the language of the web. Build interactive sites and powerful apps.</Text>
            <View className="mt-auto flex-row items-center justify-between">
              <View className="flex-row">
                {/* Simulated Avatars stack */}
                <View className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden relative z-20">
                    <Image source={{uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtfrJ7_DY2pF-8-fHLDbUIEw-bPs47hIDWvxI8sY1ICcqnlZZqLL07JV1tnhagh2ENavjv-S0Ntg9ZwTTCGrrIn8o81o4cFLsVitSLeIsyEvH5JFKCCJUSmc7M_HoGWGAKTGa5_SD4aq6W1pjhcEImI4ltQenufUHKC0m6yKxlvH3LlQbCeNV0j5BblithFEBbdCYTEG_68M9lTzC3QxpO03YbMsWaV_2f0WZE1WFOl1GQgsEaciv9Aqi_uiVgPirqiitF0u0qNZY'}} className="w-full h-full"/>
                </View>
                <View className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden -ml-2 relative z-10">
                    <Image source={{uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVcmTf3WlaIFPBzbDW8bJKblkFhtGHiLaMOgfk6JXdcgnI2BTrhXPz64Q38xH92VhEnlZ_DHrra3XUw2yyKtT30n3_0WAQup6QWEATzPkiXccriH4u4rGgJHsFT6jpTS2P4NygkQJGq3tk-fxg1hHDaibRe8JKHT3pmjgTPa-C58S79lMltvyvErNwH3qg69cL8sq4lgtAPyAqRF4kIEFL2ckN-SlQE0EhkQgyI44hyPpZ4aIO_LmBaNrcDQtg1lj4g-yrzB055PY'}} className="w-full h-full"/>
                </View>
                <View className="w-8 h-8 rounded-full border-2 border-white bg-surface-container-highest flex items-center justify-center -ml-2">
                  <Text className="text-[10px] font-bold">+12k</Text>
                </View>
              </View>
              <Pressable
                onPress={() => navigation.navigate('Map')}
                className="bg-primary px-6 py-3 rounded-xl active:translate-y-1"
                style={{ shadowColor: '#00557a', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 0 }}
              >
                <Text className="text-white font-label font-bold">START</Text>
              </Pressable>
            </View>
          </View>

          {/* Python Card */}
          <View className="bg-surface-container-lowest rounded-lg p-6 flex-col relative overflow-hidden">
            <View className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-bl-full -mr-10 -mt-10 opacity-50" />
            <View className="mb-4 w-16 h-16 bg-primary-container rounded-2xl flex items-center justify-center" style={{ shadowColor: '#00628c', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 0 }}>
              <MaterialIcons name="terminal" size={40} color="#00324a" />
            </View>
            <Text className="font-headline text-2xl font-bold mb-2 text-on-surface">Python</Text>
            <Text className="text-on-surface-variant text-sm mb-6 leading-relaxed">The versatile choice for AI, automation, and data crunching magic.</Text>
            <View className="mt-auto flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="star" size={16} color="#2a6900" />
                <Text className="text-sm font-bold text-on-surface">4.9</Text>
              </View>
              <Pressable className="bg-primary px-6 py-3 rounded-xl active:translate-y-1" style={{ shadowColor: '#00557a', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 0 }}>
                <Text className="text-white font-label font-bold">EXPLORE</Text>
              </Pressable>
            </View>
          </View>

          {/* Rust Card */}
          <View className="bg-inverse-surface rounded-lg p-8 flex-col relative overflow-hidden">
            <Text className="text-primary-container font-label text-xs font-black uppercase tracking-[0.2em] mb-2">New Course</Text>
            <Text className="font-headline text-3xl font-bold text-white mb-4">Master Rust Performance</Text>
            <Text className="text-outline-variant text-base mb-8">The most loved language is here. Learn safe memory management and blazing speed.</Text>
            <Pressable className="bg-secondary px-8 py-4 rounded-xl items-center active:translate-y-1" style={{ shadowColor: '#235b00', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 0 }}>
                <Text className="text-on-secondary font-label font-bold text-center">UNFOLD THE MYSTERY</Text>
            </Pressable>
          </View>
        </View>

        {/* Featured Collections */}
        <View className="mt-4 mb-8">
          <View className="flex-row items-center gap-3 mb-6">
            <MaterialIcons name="auto-awesome" size={32} color="#2fb8ff" />
            <Text className="font-headline text-3xl font-bold text-on-surface">Learning Paths</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row" contentContainerStyle={{ gap: 24, paddingBottom: 16 }}>
            {/* Path 1 */}
            <View className="w-[280px] bg-white rounded-lg p-2 shadow-sm border border-outline-variant/10">
              <View className="h-40 w-full rounded-md bg-surface-container-high overflow-hidden relative justify-end p-4">
                <Image
                  source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlSRnK6qh7JcV2Zn5mhQB_L_-_ntYOYvKTJviy6izt68DM0Y3_DEJCLzhB70GwxUS34Y6Ly_8YMCnBxXTl_l3Q-eRxhgMfAhh6CppxI2M3BarmMmbOwIARwqM5LrNcd8JqWDva_rtWMzUwYa27wvee1cPLQ5HInKPcflGtqQBOx5DYnzxf-eRl5fT9Q0hmudOAFvL0AB2jHqLAE7VWLDKioH00qttm7RCYURt9I-ietSSfRKdjxhdOLoAq5kmr85GHnV9Q9MdyLfk' }}
                  className="absolute inset-0 w-full h-full opacity-80"
                />
                <View className="absolute inset-0 bg-black/40" />
                <Text className="text-white font-headline text-xl font-bold z-10">Web Architect</Text>
              </View>
              <View className="p-4">
                <Text className="text-xs text-on-surface-variant mb-4">6 Courses • 42 Hours</Text>
                <View className="flex-row items-center justify-between">
                  <Text className="font-label font-bold text-primary text-sm">Continue</Text>
                  <MaterialIcons name="arrow-forward" size={20} color="#00628c" />
                </View>
              </View>
            </View>
            {/* Path 2 */}
            <View className="w-[280px] bg-white rounded-lg p-2 shadow-sm border border-outline-variant/10">
              <View className="h-40 w-full rounded-md bg-tertiary-container/30 overflow-hidden relative justify-end p-4">
                <Image
                  source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAldfbsazxJIO5ZeRspi5i_vsUgqzttI7CBxEdUUlrK_CxljKAYBG_3iG-xeeQqGXXALno-jyXiFoNdBVHf7rL6TSVBYwbyxhvUvNPV4hgvcn2e_LKASKYoobnc9lpwBRBL7Pba8EPd60uNghSnzNmrkB9dFEvknFXfHUdU_QeLp1mDurNumc0uAs4rafB1VweWv5yJuLgg2I7nPGbAYNdfCWsDJGkIHz1MngX0xAqVdtulFKI2HSnXlj8M3EjByKv7swP9LtVP05M' }}
                  className="absolute inset-0 w-full h-full opacity-80"
                />
                <View className="absolute inset-0 bg-black/40" />
                <Text className="text-white font-headline text-xl font-bold z-10">Backend Hero</Text>
              </View>
              <View className="p-4">
                <Text className="text-xs text-on-surface-variant mb-4">8 Courses • 58 Hours</Text>
                <View className="flex-row items-center justify-between">
                  <Text className="font-label font-bold text-primary text-sm">Start Learning</Text>
                  <MaterialIcons name="arrow-forward" size={20} color="#00628c" />
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <Pressable className="absolute bottom-28 right-6 w-16 h-16 bg-primary-container rounded-full flex items-center justify-center active:translate-y-1 z-40"
                 style={{ shadowColor: '#00628c', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 1, shadowRadius: 0 }}
      >
        <MaterialIcons name="add" size={32} color="#00324a" />
      </Pressable>

      {/* BottomNavBar */}
      <View className="absolute bottom-0 left-0 w-full z-50 flex-row justify-around items-center px-4 pb-6 pt-3 bg-white rounded-t-[2.5rem] border-t-4 border-[#d9eaff]">
        <Pressable
          onPress={() => navigation.navigate('Map')}
          className="flex-col items-center justify-center px-5 py-2"
        >
          <MaterialIcons name="school" size={24} color="#94a3b8" />
          <Text className="font-label font-bold text-[11px] uppercase tracking-wider text-slate-400 mt-1">Learn</Text>
        </Pressable>
        {/* Active Nav: Explore */}
        <Pressable className="flex-col items-center justify-center bg-[#d9eaff] rounded-2xl px-5 py-2 transform scale-110">
          <MaterialIcons name="explore" size={24} color="#1CB0F6" />
          <Text className="font-label font-bold text-[11px] uppercase tracking-wider text-[#1CB0F6] mt-1">Explore</Text>
        </Pressable>
        <Pressable className="flex-col items-center justify-center px-5 py-2">
          <MaterialIcons name="verified-user" size={24} color="#94a3b8" />
          <Text className="font-label font-bold text-[11px] uppercase tracking-wider text-slate-400 mt-1">Shield</Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('Progress')}
          className="flex-col items-center justify-center px-5 py-2"
        >
          <MaterialIcons name="person" size={24} color="#94a3b8" />
          <Text className="font-label font-bold text-[11px] uppercase tracking-wider text-slate-400 mt-1">Profile</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
