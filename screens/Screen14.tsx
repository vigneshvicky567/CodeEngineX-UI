import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import api from '../lib/api';

export default function Screen14() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [messages, setMessages] = useState<{role: 'user' | 'tutor', content: string}[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const contextTopic = route.params?.topic || 'General Programming';

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      // BACKEND INTEGRATION POINT: Pod 3 Tutor
      // const res = await api.post('/api/chat', { message: userMsg, context: contextTopic });
      // setMessages(prev => [...prev, { role: 'tutor', content: res.response }]);

      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessages(prev => [...prev, { role: 'tutor', content: "Here's a detailed explanation tailored to " + contextTopic + "..." }]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: 'tutor', content: "Error connecting to AI Tutor service." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#1a1a1a]">
      <View className="flex-row items-center justify-between p-4 bg-[#252525] border-b border-gray-800 shadow-sm z-10">
        <Pressable onPress={() => navigation.goBack()} className="p-2">
          <MaterialIcons name="arrow-back" size={24} color="#e5e7eb" />
        </Pressable>
        <View className="flex-row items-center gap-2">
            <MaterialIcons name="school" size={20} color="#1eb1f6" />
            <Text className="font-headline font-bold text-lg text-white">AI Tutor</Text>
        </View>
        <View className="w-10" />
      </View>
      <View className="bg-primary/20 p-2 flex-row justify-center">
         <Text className="text-primary-container text-xs font-bold uppercase tracking-wider text-center font-label">Topic: {contextTopic}</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 flex-col"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView className="flex-1 p-4" contentContainerStyle={{ paddingBottom: 20 }}>
          {messages.length === 0 && (
             <View className="flex-1 items-center justify-center mt-20 opacity-70">
                <MaterialIcons name="auto-awesome" size={64} color="#fcd34d" />
                <Text className="mt-4 font-body text-center text-gray-300">Stuck on {contextTopic}?</Text>
                <Text className="font-body text-center text-gray-500 mt-2">I can review your code or explain concepts.</Text>
             </View>
          )}
          {messages.map((msg, idx) => (
            <View key={idx} className={`mb-4 max-w-[85%] rounded-2xl p-4 ${msg.role === 'user' ? 'self-end bg-primary rounded-tr-sm' : 'self-start bg-[#333] border border-gray-700 rounded-tl-sm'}`}>
              <Text className={`font-body leading-relaxed ${msg.role === 'user' ? 'text-white' : 'text-gray-200'}`}>
                {msg.content}
              </Text>
            </View>
          ))}
          {isLoading && (
            <View className="self-start mb-4 bg-[#333] border border-gray-700 rounded-2xl rounded-tl-sm p-4">
              <Text className="font-body text-gray-400 italic">Analyzing...</Text>
            </View>
          )}
        </ScrollView>

        <View className="p-4 bg-[#252525] border-t border-gray-800 flex-row items-center gap-2">
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Ask a question..."
            placeholderTextColor="#6b7280"
            className="flex-1 bg-[#1a1a1a] border border-gray-700 rounded-full px-6 py-3 font-body text-white"
            onSubmitEditing={sendMessage}
          />
          <Pressable
            onPress={sendMessage}
            disabled={!input.trim() || isLoading}
            className={`w-12 h-12 rounded-full items-center justify-center ${input.trim() && !isLoading ? 'bg-primary' : 'bg-gray-700'}`}
          >
            <MaterialIcons name="send" size={20} color="white" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
