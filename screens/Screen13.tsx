import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import api from '../lib/api';

export default function Screen13() {
  const navigation = useNavigation<any>();
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      // BACKEND INTEGRATION POINT: Pod 3
      // const res = await api.post('/api/v1/chatbot/chat', { message: userMsg });
      // setMessages(prev => [...prev, { role: 'ai', content: res.response }]);

      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessages(prev => [...prev, { role: 'ai', content: "I'm the AI Chatbot mock response!" }]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: 'ai', content: "Error connecting to AI service." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="flex-row items-center justify-between p-4 bg-white border-b border-gray-100 shadow-sm z-10">
        <Pressable onPress={() => navigation.goBack()} className="p-2">
          <MaterialIcons name="arrow-back" size={24} color="#4B4B4B" />
        </Pressable>
        <Text className="font-headline font-bold text-lg text-on-surface">AI Chatbot</Text>
        <View className="w-10" />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 flex-col"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView className="flex-1 p-4" contentContainerStyle={{ paddingBottom: 20 }}>
          {messages.length === 0 && (
             <View className="flex-1 items-center justify-center mt-20 opacity-50">
                <MaterialIcons name="smart-toy" size={64} color="#00628c" />
                <Text className="mt-4 font-body text-center">How can I help you code today?</Text>
             </View>
          )}
          {messages.map((msg, idx) => (
            <View key={idx} className={`mb-4 max-w-[80%] rounded-2xl p-4 ${msg.role === 'user' ? 'self-end bg-primary rounded-tr-sm' : 'self-start bg-surface-container-highest rounded-tl-sm'}`}>
              <Text className={`font-body ${msg.role === 'user' ? 'text-white' : 'text-on-surface'}`}>
                {msg.content}
              </Text>
            </View>
          ))}
          {isLoading && (
            <View className="self-start mb-4 bg-surface-container-highest rounded-2xl rounded-tl-sm p-4">
              <Text className="font-body text-on-surface-variant italic">Thinking...</Text>
            </View>
          )}
        </ScrollView>

        <View className="p-4 bg-white border-t border-gray-100 flex-row items-center gap-2">
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Ask anything..."
            className="flex-1 bg-surface-container-lowest border border-outline-variant rounded-full px-6 py-3 font-body text-on-surface"
            onSubmitEditing={sendMessage}
          />
          <Pressable
            onPress={sendMessage}
            disabled={!input.trim() || isLoading}
            className={`w-12 h-12 rounded-full items-center justify-center ${input.trim() && !isLoading ? 'bg-primary' : 'bg-surface-variant'}`}
          >
            <MaterialIcons name="send" size={20} color="white" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
