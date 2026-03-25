import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export interface TabItem {
  name: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  route?: string;
}

export interface BottomNavBarProps {
  activeTab: string;
  tabs: TabItem[];
  containerClassName?: string;
}

export default function BottomNavBar({ activeTab, tabs, containerClassName = "bg-white rounded-t-[2.5rem] border-t-4 border-[#d9eaff]" }: BottomNavBarProps) {
  const navigation = useNavigation<any>();

  return (
    <View className={`absolute bottom-0 left-0 w-full z-50 flex-row justify-around items-center px-4 pb-6 pt-3 ${containerClassName}`}>
      {tabs.map((tab) => {
        const isActive = tab.name === activeTab;

        if (isActive) {
          return (
            <Pressable key={tab.name} className="flex-col items-center justify-center bg-[#d9eaff] rounded-2xl px-5 py-2 transform scale-110 active:scale-95">
              <MaterialIcons name={tab.icon} size={24} color="#1CB0F6" />
              <Text className="font-label font-bold text-[11px] uppercase tracking-wider text-[#1CB0F6] mt-1">{tab.name}</Text>
            </Pressable>
          );
        }

        return (
          <Pressable
            key={tab.name}
            onPress={() => {
              if (tab.route) {
                navigation.navigate(tab.route);
              }
            }}
            className="flex-col items-center justify-center px-5 py-2 active:scale-95"
          >
            <MaterialIcons name={tab.icon} size={24} color="#94a3b8" />
            <Text className="font-label font-bold text-[11px] uppercase tracking-wider text-slate-400 mt-1">{tab.name}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}