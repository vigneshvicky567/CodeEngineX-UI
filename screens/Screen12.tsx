import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Screen12() {
  const navigation = useNavigation<any>();
  const [showConsole, setShowConsole] = useState(false);
  const [code, setCode] = useState('let greeting = "Hello World!";\nconsole.log(greeting);');

  const keys = ['{ }', '[ ]', '( )', '=', '" "', "' '", ';', '$'];

  return (
    <SafeAreaView className="flex-1 bg-background-light" edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 relative">
        {/* Header */}
        <View className="flex-row items-center justify-between p-4 bg-surface z-20 border-b border-gray-100">
          <Pressable
            onPress={() => navigation.goBack()}
            className="w-10 h-10 items-center justify-center rounded-full bg-surface-alt"
          >
            <MaterialIcons name="arrow-back" size={24} color="#AFAFAF" />
          </Pressable>
          <View className="flex-1 justify-center items-center">
            <View className="h-3 w-32 bg-surface-alt rounded-full overflow-hidden flex-row">
              <View className="h-full bg-success w-2/3 rounded-full" />
            </View>
          </View>
          <Pressable className="w-10 h-10 items-center justify-center rounded-full bg-surface-alt">
            <MaterialIcons name="more-horiz" size={24} color="#AFAFAF" />
          </Pressable>
        </View>

        {/* Instructions */}
        <View className="bg-surface z-10 rounded-b-xl border-b border-gray-100 px-4 pt-4 pb-6" style={{ shadowColor: '#4B4B4B', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 }}>
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="emoji-objects" size={20} color="#1eb1f6" />
              <Text className="text-text-main text-lg font-bold">Instructions</Text>
            </View>
            <MaterialIcons name="expand-less" size={20} color="#AFAFAF" />
          </View>
          <Text className="text-text-main text-base font-medium">
            Create a variable called <Text className="font-code bg-surface-alt text-primary"> greeting </Text> and print it.
          </Text>
        </View>

        {/* Code Editor */}
        <ScrollView className="flex-1 bg-background-light p-4">
          <View className="bg-surface rounded-xl p-4 min-h-[400px] flex-row border border-gray-100" style={{ shadowColor: '#4B4B4B', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 }}>
            {/* Line Numbers */}
            <View className="w-8 text-right pr-3 border-r border-gray-100 pt-1">
              {[1,2,3,4,5].map(n => <Text key={n} className="text-muted font-code text-sm leading-relaxed text-right">{n}</Text>)}
            </View>
            <TextInput
              multiline
              value={code}
              onChangeText={setCode}
              className="flex-1 pl-3 pt-1 font-code text-sm leading-relaxed text-text-main"
              textAlignVertical="top"
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
            />
          </View>
        </ScrollView>

        {/* Quick Type Bar */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="bg-surface border-t border-gray-200 py-2 px-2 z-20 flex-row" contentContainerStyle={{ gap: 8 }}>
          {keys.map((k, i) => (
            <Pressable key={i} className="bg-surface-alt h-10 min-w-[48px] px-3 rounded-lg items-center justify-center active:translate-y-1" style={{ shadowColor: '#E5E7EB', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 0 }}>
              <Text className="text-text-main font-code font-bold">{k}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Floating Action Button (Run Code) */}
        <Pressable
          onPress={() => setShowConsole(!showConsole)}
          className="absolute bottom-24 right-6 w-16 h-16 bg-success rounded-full items-center justify-center z-30 active:scale-95"
          style={{ shadowColor: '#58A700', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 0 }}
        >
          <MaterialIcons name="play-arrow" size={36} color="white" />
        </Pressable>

        {/* Console Drawer */}
        {showConsole && (
          <View className="absolute bottom-0 left-0 right-0 h-[200px] bg-console-bg rounded-t-xl z-40" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: -8 }, shadowOpacity: 0.15, shadowRadius: 16 }}>
            <View className="w-full items-center py-2">
              <View className="w-12 h-1.5 bg-gray-600 rounded-full" />
            </View>
            <View className="flex-row justify-between items-center px-4 pb-2 border-b border-gray-700">
              <Text className="text-gray-300 font-bold text-sm tracking-wide">CONSOLE</Text>
              <Pressable onPress={() => setShowConsole(false)}>
                <MaterialIcons name="close" size={20} color="#9ca3af" />
              </Pressable>
            </View>
            <ScrollView className="flex-1 p-4">
              <View className="flex-row items-start gap-2 mb-1">
                <Text className="text-gray-500 font-code">&gt;</Text>
                <Text className="text-success font-code">Hello World!</Text>
              </View>
            </ScrollView>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
