import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './navigation/AppNavigator';
import * as Font from 'expo-font';
import { cssInterop } from 'nativewind';
import Svg, { Path, Rect, Circle } from 'react-native-svg';

cssInterop(Svg, { className: 'style' });
cssInterop(Path, { className: 'style' });
cssInterop(Rect, { className: 'style' });
cssInterop(Circle, { className: 'style' });
import {
  Fredoka_400Regular,
  Fredoka_500Medium,
  Fredoka_600SemiBold,
  Fredoka_700Bold,
} from '@expo-google-fonts/fredoka';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import {
  BeVietnamPro_400Regular,
  BeVietnamPro_500Medium,
  BeVietnamPro_600SemiBold,
  BeVietnamPro_700Bold,
} from '@expo-google-fonts/be-vietnam-pro';
import {
  FiraCode_400Regular,
  FiraCode_500Medium,
} from '@expo-google-fonts/fira-code';
import './global.css';

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Fredoka': Fredoka_400Regular,
        'Fredoka-Medium': Fredoka_500Medium,
        'Fredoka-SemiBold': Fredoka_600SemiBold,
        'Fredoka-Bold': Fredoka_700Bold,
        'PlusJakartaSans': PlusJakartaSans_400Regular,
        'PlusJakartaSans-Medium': PlusJakartaSans_500Medium,
        'PlusJakartaSans-SemiBold': PlusJakartaSans_600SemiBold,
        'PlusJakartaSans-Bold': PlusJakartaSans_700Bold,
        'PlusJakartaSans-ExtraBold': PlusJakartaSans_800ExtraBold,
        'BeVietnamPro': BeVietnamPro_400Regular,
        'BeVietnamPro-Medium': BeVietnamPro_500Medium,
        'BeVietnamPro-SemiBold': BeVietnamPro_600SemiBold,
        'BeVietnamPro-Bold': BeVietnamPro_700Bold,
        'FiraCode': FiraCode_400Regular,
        'FiraCode-Medium': FiraCode_500Medium,
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
