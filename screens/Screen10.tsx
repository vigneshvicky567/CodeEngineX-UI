import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Screen10() {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView className="flex-1 bg-surface flex-col">
      {/* TopAppBar */}
      <View className="flex-row items-center justify-between px-6 py-4 w-full bg-[#f2f7ff] z-50">
        <View className="flex-row items-center gap-4">
          <Pressable
            onPress={() => navigation.navigate('MainTabs')}
            className="w-10 h-10 flex items-center justify-center rounded-xl active:translate-y-1"
          >
            <MaterialIcons name="close" size={24} color="#64748b" />
          </Pressable>
        </View>
        <Text className="font-label font-bold text-lg text-[#1CB0F6]">Lesson Complete</Text>
        <View className="w-10" />
      </View>

      <View className="flex-1 flex-col items-center justify-center px-6 relative overflow-hidden">
        {/* Confetti Background Layer - simulated via absolute view logic */}
        <View className="absolute inset-0 opacity-15" />

        {/* Top Section: Mascot */}
        <View className="relative z-10 mb-8 transform hover:scale-105 transition-transform duration-500">
          <View className="w-64 h-64 bg-surface-container rounded-full flex items-center justify-center relative shadow-inner">
            <Image
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA8w5vLxrrRb7MnP-F7CQ99KROkbO7Ujk8yWnZcFP-7a_yD4p6hN7a4calTYBfzHUL5oLJolNl28m-T01SWWVoSB7BlbTctUGaqQZKaWYvjVSsHQZ0yw_3Mxx1blhdCSknQ8v3oQf8Y9aC7VcXH-fhoeQ8UdSkuPXC5rSiVPZQGRDOWGDs_IJUbpN56mHiFMm08LcAdWK3z7lchJF0QIb0psMXKQg48TEQ3NOJUf9aSe4ry93vLwZkfdz5i-C8DTzBoZ6swEmFnXTM' }}
              className="w-48 h-48"
              resizeMode="contain"
            />
            {/* Floating Celebration Elements */}
            <View className="absolute -top-4 -right-2 bg-secondary-container p-3 rounded-xl shadow-lg rotate-12">
              <MaterialIcons name="auto-awesome" size={32} color="#245c00" />
            </View>
          </View>
        </View>

        {/* Middle Section: Hero Text & Rewards */}
        <View className="items-center z-10 space-y-6 max-w-md w-full gap-6">
          <View className="items-center space-y-2 gap-2">
            <Text className="font-headline font-extrabold text-5xl tracking-tight text-primary-container uppercase">
              Amazing!
            </Text>
            <Text className="text-on-surface-variant font-medium text-lg">You nailed that boolean logic challenge.</Text>
          </View>

          {/* Reward Bento Grid */}
          <View className="flex-row justify-between w-full pt-4 gap-4">
            <View className="flex-1 bg-surface-container-lowest p-6 rounded-lg border-b-4 border-secondary/20 flex-col items-center gap-2">
              <View className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center">
                <MaterialIcons name="bolt" size={24} color="#245c00" />
              </View>
              <Text className="font-headline font-bold text-2xl text-secondary">+15 XP</Text>
              <Text className="font-label font-bold uppercase tracking-widest text-outline text-xs">Bonus</Text>
            </View>
            <View className="flex-1 bg-surface-container-lowest p-6 rounded-lg border-b-4 border-tertiary-container/40 flex-col items-center gap-2">
              <View className="w-12 h-12 rounded-full bg-tertiary-container flex items-center justify-center">
                <MaterialIcons name="diamond" size={24} color="#574300" />
              </View>
              <Text className="font-headline font-bold text-2xl text-tertiary-dim">+2 Gems</Text>
              <Text className="font-label font-bold uppercase tracking-widest text-outline text-xs">Loot</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Bottom Section: Action */}
      <View className="p-8 w-full max-w-2xl mx-auto space-y-4 gap-4">
        {/* Fun Fact Card */}
        <View className="bg-primary-container/10 p-4 rounded-xl flex-row items-start gap-4 mb-4">
          <MaterialIcons name="lightbulb" size={24} color="#00628c" />
          <Text className="text-sm text-on-surface-variant leading-relaxed flex-1 flex-wrap">
            <Text className="font-bold text-primary">Pro Tip: </Text>
            Booleans are the simplest data type, holding only <Text className="font-code bg-white">true</Text> or <Text className="font-code bg-white">false</Text> values!
          </Text>
        </View>

        <Pressable
          onPress={() => navigation.navigate('MainTabs')}
          className="w-full py-5 bg-primary rounded-lg active:scale-95"
          style={{ shadowColor: '#00557a', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 0 }}
        >
          <Text className="text-white text-center font-headline font-extrabold text-xl tracking-wide uppercase">CONTINUE</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
