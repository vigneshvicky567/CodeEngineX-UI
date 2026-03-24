import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Screen1() {
  const navigation = useNavigation<any>();
  const [selected, setSelected] = useState<string | null>('Web Dev');

  const options = [
    { id: 'Python', icon: 'code', label: 'Python' },
    { id: 'Web Dev', icon: 'language', label: 'Web Dev' },
    { id: 'Mobile Apps', icon: 'smartphone', label: 'Mobile Apps' },
    { id: 'Game Dev', icon: 'sports-esports', label: 'Game Dev' },
    { id: 'Data Science', icon: 'monitoring', label: 'Data Science' },
    { id: 'AI', icon: 'psychology', label: 'AI' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#f2f7ff]">
      {/* TopAppBar */}
      <View className="flex-row items-center justify-between px-6 py-4 w-full">
        <Pressable
          onPress={() => navigation.goBack()}
          className="p-2 rounded-full active:bg-[#d9eaff]"
        >
          <MaterialIcons name="arrow-back" size={24} color="#1CB0F6" />
        </Pressable>
        <Text className="font-headline font-bold text-2xl text-[#1CB0F6]">Step 1 of 3</Text>
        <View className="w-10" />
      </View>
      <View className="px-6 pb-2">
        <View className="bg-[#d9eaff] h-4 w-full rounded-full overflow-hidden relative">
          <View className="absolute top-0 left-0 h-full bg-[#1CB0F6] w-1/3 rounded-full" />
        </View>
      </View>

      <ScrollView className="flex-1 w-full px-6 pt-8 pb-32">
        <View className="mb-10 items-center">
          <Text className="font-headline text-3xl font-extrabold text-on-background tracking-tight mb-4 text-center">What do you want to learn?</Text>
          <Text className="text-on-surface-variant text-lg font-medium opacity-80 text-center">Pick your path to start your adventure.</Text>
        </View>

        {/* Interest Selection Grid */}
        <View className="flex-row flex-wrap justify-between">
          {options.map((option) => {
            const isSelected = selected === option.id;
            return (
              <Pressable
                key={option.id}
                onPress={() => setSelected(option.id)}
                className={`w-[48%] mb-6 flex-col items-center justify-center p-6 bg-white rounded-lg active:translate-y-1 ${
                  isSelected
                    ? 'border-2 border-[#1CB0F6] bg-[#e8f1ff]'
                    : 'border-2 border-[#d9eaff]'
                }`}
                style={{
                    shadowColor: isSelected ? '#00557a' : '#d9eaff',
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 1,
                    shadowRadius: 0,
                    elevation: 0,
                }}
              >
                <View className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isSelected ? 'bg-primary-container' : 'bg-surface-container-low'}`}>
                  <MaterialIcons
                    name={option.icon as any}
                    size={40}
                    color={isSelected ? 'white' : '#00628c'}
                  />
                </View>
                <Text className={`font-headline font-bold text-lg ${isSelected ? 'text-primary' : 'text-on-surface'}`}>{option.label}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Illustration Break */}
        <View className="mt-6 p-8 bg-surface-container rounded-lg flex-row items-center justify-between overflow-hidden relative mb-24">
          <View className="flex-1 z-10 pr-4">
            <Text className="font-headline text-xl font-extrabold text-primary mb-2">Can't decide?</Text>
            <Text className="text-on-surface-variant font-medium">You can explore other paths anytime after you join!</Text>
          </View>
          <View className="shrink-0 z-10">
            <Image
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8lAiNyY1KY6wCDttv-dE2Lku04wvizAAsDDXjiCgcnEmfTDRq8z62cWbxbIOMSv5c8CZEO5w4KNGDIn5bhpG3D0TGVEsvWwd6P1_bpLpehMtsh2oVupxmTqZWTRHHHRAhI80SLvHz8HKYN7_ArChylCgY_hxbWTLVfCZYVVkPLh9EEbt0D9CLagtRsDIlTeyXGOv6wgRv0CkTXfI-R9WYZvFmT8upo6mu6mWyg_u3rFDPgUGnK2xTWJqfewGCjzPTnJ8Sl5FlpzI' }}
              className="w-20 h-20 transform rotate-12"
              resizeMode="contain"
            />
          </View>
          <View className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary-container opacity-20 rounded-full" />
        </View>
      </ScrollView>

      {/* BottomNavBar */}
      <View className="absolute bottom-0 left-0 w-full h-24 bg-white flex-row justify-around items-center px-8 pb-4 rounded-t-[2.5rem] border-t-4 border-[#d9eaff] z-50">
        <Pressable
          onPress={() => navigation.goBack()}
          className="flex-col items-center justify-center px-6 py-3 active:translate-y-1"
        >
          <MaterialIcons name="chevron-left" size={32} color="#90b0d3" />
          <Text className="font-label font-bold text-sm uppercase tracking-wider text-[#90b0d3]">Back</Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('ExperienceLevel')}
          className="flex-row items-center justify-center bg-[#1CB0F6] rounded-2xl px-12 py-4 active:translate-y-1"
          style={{
            shadowColor: '#00628c',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 1,
            shadowRadius: 0,
          }}
        >
          <Text className="font-label font-bold text-sm uppercase tracking-wider text-white mr-2">Continue</Text>
          <MaterialIcons name="keyboard-double-arrow-right" size={24} color="white" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
