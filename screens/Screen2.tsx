import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../lib/api';

const options = [
  { id: 'Brand New', icon: 'local-florist', title: 'Brand New', desc: "I've never written a line of code.", color: 'bg-secondary-container', iconColor: 'text-on-secondary-container' },
  { id: 'I know some', icon: 'auto-awesome', title: 'I know some', desc: "I've played around with a few tutorials.", color: 'bg-primary-container', iconColor: 'text-on-primary-container' },
  { id: 'I\'m a pro', icon: 'rocket', title: 'I\'m a pro', desc: "I've built apps or projects before.", color: 'bg-tertiary-container', iconColor: 'text-on-tertiary-container' },
];

export default function Screen2() {
  const navigation = useNavigation<any>();
  const [selected, setSelected] = useState<string | null>('I know some');

  // BACKEND: POST /api/user/experience
  // Endpoint to save the user's selected experience level during onboarding.
  // Request body: { userId: string, experienceLevel: string }
  // Response: { success: boolean, updatedUser: object }
  const handleContinue = () => {
    // BACKEND INTEGRATION POINT:
    // try {
    //   await axios.post('/api/user/experience', { experienceLevel: selected });
    // } catch (e) { ... }
    navigation.navigate('GoalSetting');
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Top AppBar */}
      <View className="flex-row justify-between items-center px-6 py-4 w-full bg-[#f2f7ff]/70 z-50">
        <Pressable
          onPress={() => navigation.goBack()}
          className="w-12 h-12 flex items-center justify-center rounded-xl bg-surface-container-low"
        >
          <MaterialIcons name="arrow-back" size={24} color="#00628c" />
        </Pressable>
        {/* Progress Bar Container */}
        <View className="flex-1 max-w-md mx-4">
          <View className="h-4 bg-surface-container-highest rounded-full overflow-hidden flex-row">
            {/* 2/3 Progress */}
            <View className="h-full w-[66%] bg-secondary rounded-full" />
          </View>
        </View>
        <Pressable
          onPress={() => navigation.navigate('Auth')}
          className="w-12 h-12 flex items-center justify-center rounded-xl bg-surface-container-low"
        >
          <MaterialIcons name="close" size={24} color="#5a7a9a" />
        </Pressable>
        <View className="bg-[#d9eaff] h-[4px] w-full absolute bottom-0 left-0 right-0" />
      </View>

      <ScrollView className="flex-1 px-6 pt-8 pb-32 max-w-2xl mx-auto w-full">
        {/* Mascot Interaction Area */}
        <View className="mb-8 flex-col items-center text-center">
          <View className="mb-4">
            <Image
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_vsHyZb6S3GbkexILBVVu3_1roEt3ZAQzAerPaK8bp0TTHuMzgKbWI3_fBG9WY-Fa3hWbsWaoMNjeggEUb31eb6cDk8BrWQj2vPu-I73qHEmwvMxHz6X4u0xTKmj4uqF0QPtKWZQzhYwnLEe8258f8PXHg1TbE3vakvzoXM3C-2ycZxiMLdDOcGVkUkJ5mqL8bUslY7C9IKB4I0nejxhQIKBCYQtl9HRkyQjfgERvnLHMjNwzyBFN1_ipiCQQ_zAvhr7JWdXDYYM' }}
              className="w-24 h-24"
              resizeMode="contain"
            />
          </View>
          <Text className="font-headline text-4xl text-on-surface font-bold tracking-tight mb-4 text-center">How much coding do you know?</Text>
        </View>

        {/* Options Grid */}
        <View className="w-full space-y-4">
          {options.map((option) => {
            const isSelected = selected === option.id;
            return (
              <Pressable
                key={option.id}
                onPress={() => setSelected(option.id)}
                className={`w-full flex-row items-center p-5 bg-surface-container-lowest rounded-lg mb-4 active:translate-y-1 ${
                  isSelected
                    ? 'border-4 border-primary-container'
                    : 'border-2 border-outline-variant/20'
                }`}
                style={{
                  shadowColor: isSelected ? '#00628c' : '#90b0d3',
                  shadowOffset: { width: 0, height: isSelected ? 6 : 4 },
                  shadowOpacity: isSelected ? 1 : 0.3,
                  shadowRadius: 0,
                  elevation: 0,
                }}
              >
                <View className={`w-16 h-16 rounded-xl flex items-center justify-center mr-5 shrink-0 ${option.color}`}>
                  <MaterialIcons name={option.icon as any} size={32} color={option.id === 'I know some' ? '#00324a' : option.id === 'I\'m a pro' ? '#574300' : '#245c00'} />
                </View>
                <View className="flex-grow">
                  <Text className="font-headline text-xl font-bold text-on-surface">{option.title}</Text>
                  <Text className="text-on-surface-variant font-medium">{option.desc}</Text>
                </View>
                {isSelected ? (
                  <View className="w-6 h-6 rounded-full bg-primary-container flex items-center justify-center shrink-0">
                    <MaterialIcons name="check" size={16} color="white" />
                  </View>
                ) : (
                  <View className="w-6 h-6 rounded-full border-2 border-outline-variant shrink-0" />
                )}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View className="absolute bottom-0 left-0 right-0 p-6 bg-surface/80 border-t-2 border-surface-container-high z-40">
        <View className="max-w-2xl mx-auto flex-col md:flex-row gap-4 items-center">
          <Pressable
            onPress={handleContinue}
            className="w-full py-5 bg-primary rounded-lg active:translate-y-1"
            style={{
              shadowColor: '#00557a',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 1,
              shadowRadius: 0,
              elevation: 0,
            }}
          >
            <Text className="text-white text-center font-headline text-xl font-extrabold uppercase tracking-widest">CONTINUE</Text>
          </Pressable>
          <Text className="text-label-sm text-outline font-bold uppercase tracking-tighter md:hidden text-center mt-2">Step 2 of 3</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
