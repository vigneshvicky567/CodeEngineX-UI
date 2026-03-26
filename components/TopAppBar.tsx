import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const AVATAR_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAEo3zD1b3eIFDkDwKkaSUpZwnFlFXIihp6zaKs1mSDudz9bN1LXnA061hWFMjFAJMKHMxL5yqK-NNwX4ctLNJO8xJkRvbGW_VhUyRX_msvq4-8m7i0RYcumovQAhhChwPLjbruzNBaRXz1KMcdOb5zXr-G95S52qDOO7tXa53aiRwyf-FXQLSezbXEpqal1_CzQVS2n970kFact9AiQMEIzkdHp4EKlwNC_j1k0Lut6AWdEl61XW_XD_YvAE_jC2GgrjBLT4zxVp4';

export interface TopAppBarProps {
  /** Shows avatar + "CodeQuest" brand text on the left (main tabs: Screen6, Screen7) */
  showBrand?: boolean;
  /** When combined with showBrand, shows a menu icon instead of the avatar (Screen9) */
  onMenu?: () => void;
  /** Shows a back arrow on the left (Screen11) */
  onBack?: () => void;
  /** Title text shown when not in brand mode */
  title?: string;
  /** Slot for right-side content (stats, buttons, etc.) */
  rightContent?: React.ReactNode;
  /** Extra className for the root View (e.g. background color) */
  className?: string;
}

export default function TopAppBar({
  showBrand,
  onMenu,
  onBack,
  title,
  rightContent,
  className = '',
}: TopAppBarProps) {
  const leftIcon =
    showBrand && !onMenu ? (
      <View className="w-10 h-10 rounded-full bg-tertiary-container flex items-center justify-center overflow-hidden border-2 border-white">
        <Image source={{ uri: AVATAR_URI }} className="w-full h-full" />
      </View>
    ) : onBack ? (
      <Pressable onPress={onBack} className="p-2 rounded-full active:bg-[#e0f2fe]">
        <MaterialIcons name="arrow-back" size={24} color="#0ea5e9" />
      </Pressable>
    ) : onMenu ? (
      <Pressable onPress={onMenu} className="p-2 rounded-xl active:translate-y-1">
        <MaterialIcons name="menu" size={24} color="#64748b" />
      </Pressable>
    ) : null;

  return (
    <View className={`w-full z-50 flex-row justify-between items-center px-6 py-4 ${className}`}>
      <View className="flex-row items-center gap-3">
        {leftIcon}
        {showBrand ? (
          <Text className="text-[#1CB0F6] font-['Fredoka'] font-black italic text-2xl tracking-tight">
            CodeQuest
          </Text>
        ) : title ? (
          <Text className="font-headline text-2xl font-black tracking-tight text-on-background">
            {title}
          </Text>
        ) : null}
      </View>
      {rightContent && (
        <View className="flex-row items-center gap-2">{rightContent}</View>
      )}
    </View>
  );
}
