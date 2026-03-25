import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const options = [
  { id: 'Casual', icon: 'local-florist', title: 'Casual', desc: '5 mins / day', iconColor: '#00628c' },
  { id: 'Regular', icon: 'grass', title: 'Regular', desc: '10 mins / day', iconColor: '#00628c', badge: 'Popular' },
  { id: 'Serious', icon: 'forest', title: 'Serious', desc: '15 mins / day', iconColor: '#00628c' },
  { id: 'Insane', icon: 'local-fire-department', title: 'Insane', desc: '30 mins / day', iconColor: '#00628c' },
];

export default function Screen3() {
  const navigation = useNavigation<any>();
  const [selected, setSelected] = useState<string | null>('Regular');

  // BACKEND: POST /api/user/goal
  // Endpoint to save the user's daily goal during onboarding.
  // Request body: { userId: string, dailyGoalId: string }
  // Response: { success: boolean, updatedUser: object }
  const handleStart = () => {
    // BACKEND INTEGRATION POINT:
    // try {
    //   await axios.post('/api/user/goal', { dailyGoalId: selected });
    // } catch (e) { ... }
    navigation.navigate('MainTabs');
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Top Navigation Anchor */}
      <View className="bg-[#f2f7ff] flex-row justify-between items-center px-6 h-16 w-full max-w-7xl mx-auto z-50">
        <View className="flex-row items-center gap-4">
          <Pressable
            onPress={() => navigation.goBack()}
            className="p-2 rounded-full active:bg-[#d9eaff]"
          >
            <MaterialIcons name="arrow-back" size={24} color="#1CB0F6" />
          </Pressable>
          <Text className="font-label text-xl font-black text-[#1CB0F6]">Goal Setting</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <View className="h-2 w-24 bg-surface-container-highest rounded-full overflow-hidden">
            <View className="h-full w-[100%] bg-secondary rounded-full" />
          </View>
          <Text className="text-xs font-bold text-on-surface-variant px-2">3/3</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 pt-8 pb-32 max-w-2xl mx-auto w-full">
        {/* Header Section */}
        <View className="mb-10 items-center">
          <Text className="font-headline font-bold text-3xl md:text-4xl text-[#0F172A] leading-tight mb-4 text-center">
            How much time can you commit?
          </Text>
          <Text className="text-on-surface-variant font-medium text-center">Choose a daily goal that fits your schedule.</Text>
        </View>

        {/* Goal Options Bento Grid */}
        <View className="flex-row flex-wrap justify-between mb-8">
          {options.map((option) => {
            const isSelected = selected === option.id;
            return (
              <Pressable
                key={option.id}
                onPress={() => setSelected(option.id)}
                className={`w-[48%] mb-4 flex-row items-center p-6 bg-surface-container-lowest rounded-lg active:translate-y-1 ${
                  isSelected
                    ? 'border-2 border-primary bg-primary-container/10'
                    : 'border-2 border-transparent'
                }`}
                style={{
                  shadowColor: isSelected ? '#00628c' : '#90b0d3',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 1,
                  shadowRadius: 0,
                  elevation: 0,
                }}
              >
                <View className={`p-3 rounded-2xl mr-4 ${isSelected ? 'bg-primary-container/20 scale-110' : 'bg-surface-container'}`}>
                  <MaterialIcons name={option.icon as any} size={32} color={option.iconColor} />
                </View>
                <View className="flex-col">
                  <View className="flex-row items-center gap-2">
                    <Text className="font-headline font-extrabold text-lg text-on-surface">{option.title}</Text>
                    {option.badge && (
                      <View className="bg-secondary px-2 py-0.5 rounded-full">
                        <Text className="text-on-secondary text-[10px] font-bold uppercase tracking-wider">{option.badge}</Text>
                      </View>
                    )}
                  </View>
                  <Text className="text-on-surface-variant text-sm font-semibold">{option.desc}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Motivational Tip Box */}
        <View className="relative bg-tertiary-container/20 p-6 rounded-lg border-dashed border-2 border-tertiary-fixed-dim/30 flex-row items-start gap-4 overflow-hidden mb-12">
          <View className="absolute -top-4 -right-4 opacity-10">
            <MaterialIcons name="lightbulb" size={96} color="#725800" />
          </View>
          <View className="bg-tertiary-container p-2 rounded-xl shrink-0">
            <MaterialIcons name="tips-and-updates" size={24} color="#574300" />
          </View>
          <Text className="text-on-tertiary-container font-semibold leading-relaxed relative z-10 flex-1">
            Consistency is more important than duration. Even 5 minutes a day builds a powerful learning habit!
          </Text>
        </View>

        {/* Visual Anchor */}
        <View className="flex-row justify-center mb-6">
          <View className="relative w-48 h-48 bg-surface-container rounded-full flex items-center justify-center overflow-visible">
            <View className="absolute inset-0 bg-primary-container/10 rounded-full" />
            <Image
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAAxcKDrCe4Uiw-jfwHp8r4kT4HVQ2ucnlN009t898YjgLIIUzVbElrF9hyl54UhPiklDl8ctu8jyf9fy0IdYg_DaXci3rYY6wlFzvPxQw7I0nBrtXZfhzu7e-Q5aGZvglp43JoCaXMeUz9lx-mxXMentWW14EUEzxKECRQ1QKMVZqO4FDi16Pd_H9NuHerL83UWHkB0WqP1OrQT6fEFbJ8kza1quDM-qI5MzxMRCydHEq_bHCBicfCzdbKjkpRv4Ed_lpslD6cnfI' }}
              className="w-40 h-40 z-20 translate-y-[-10%]"
              resizeMode="contain"
            />
            <View className="absolute -bottom-2 bg-white px-4 py-2 rounded-xl border-2 border-primary/10 flex-row items-center gap-2 scale-90"
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 10,
                  }}
            >
              <MaterialIcons name="auto-awesome" size={16} color="#00628c" />
              <Text className="font-bold text-primary">Let's go!</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer Action */}
      <View className="absolute bottom-0 left-0 right-0 p-6 bg-white/70 flex-row justify-center z-50">
        <Pressable
          onPress={handleStart}
          className="w-full max-w-md bg-primary py-5 rounded-lg active:translate-y-1 flex-row items-center justify-center gap-3"
          style={{
            shadowColor: '#00557a',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 1,
            shadowRadius: 0,
            elevation: 0,
          }}
        >
          <Text className="text-on-primary font-headline font-black text-xl tracking-wider">LET'S START!</Text>
          <MaterialIcons name="rocket-launch" size={24} color="white" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
