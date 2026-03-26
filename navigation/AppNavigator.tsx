import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Placeholder imports
import Screen1 from '../screens/Screen1';
import Screen2 from '../screens/Screen2';
import Screen3 from '../screens/Screen3';
import Screen4 from '../screens/Screen4';
import Screen5 from '../screens/Screen5';
import Screen6 from '../screens/Screen6';
import Screen7 from '../screens/Screen7';
import Screen8 from '../screens/Screen8';
import Screen9 from '../screens/Screen9';
import Screen10 from '../screens/Screen10';
import Screen11 from '../screens/Screen11';
import Screen12 from '../screens/Screen12';
import Screen13 from '../screens/Screen13';
import Screen14 from '../screens/Screen14';
import { MaterialIcons } from '@expo/vector-icons';
import { View } from 'react-native';
import { useAuthStore } from '../store/authStore';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' }, // We will use custom tab bars in the screens
      }}
    >
      <Tab.Screen name="Explore" component={Screen7} />
      <Tab.Screen name="Map" component={Screen6} />
      <Tab.Screen name="Achievements" component={Screen9} />
      <Tab.Screen name="Progress" component={Screen11} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Dynamic based on auth state */}
      {!isLoggedIn ? (
        <>
          <Stack.Screen name="Auth" component={Screen4} />
          <Stack.Screen name="PathSelection" component={Screen1} />
          <Stack.Screen name="ExperienceLevel" component={Screen2} />
          <Stack.Screen name="GoalSetting" component={Screen3} />
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        </>
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        </>
      )}

      {/* Lessons & Interactive */}
      <Stack.Screen name="LessonIntro" component={Screen5} />
      <Stack.Screen name="LessonQuiz" component={Screen8} />
      <Stack.Screen name="LessonComplete" component={Screen10} />
      <Stack.Screen name="MobileIDE" component={Screen12} />
          <Stack.Screen name="AIChatbot" component={Screen13} />
          <Stack.Screen name="AITutor" component={Screen14} />
    </Stack.Navigator>
  );
}
