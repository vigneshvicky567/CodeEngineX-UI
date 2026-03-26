import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { post, get } from '../lib/api';

export default function Screen13({ navigation }: any) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // load history initially if needed
    // get('/api/v1/chatbot/history').then(setMessages).catch(console.error);
    setMessages([{ role: 'ai', content: 'Hello! I am your AI Chatbot. How can I help you learn today?' }]);
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await post('/api/v1/chatbot/chat', { message: input });
      setMessages((prev) => [...prev, { role: 'ai', content: (response as any).message }]);
    } catch (e) {
      setMessages((prev) => [...prev, { role: 'ai', content: 'Oops, something went wrong. Please try again later.' }]);
    } finally {
      setLoading(false);
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-900">
      <View className="flex-row items-center p-4 border-b border-neutral-800">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <MaterialIcons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text className="text-xl font-Fredoka-Medium text-white">AI Chatbot</Text>
      </View>

      <ScrollView
        ref={scrollViewRef}
        className="flex-1 p-4"
        contentContainerStyle={{ paddingBottom: 20 }}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((msg, i) => (
          <View key={i} className={`mb-4 max-w-[80%] p-3 rounded-2xl ${msg.role === 'user' ? 'bg-primary self-end rounded-tr-sm' : 'bg-neutral-800 self-start rounded-tl-sm'}`}>
            <Text className="text-white font-PlusJakartaSans">{msg.content}</Text>
          </View>
        ))}
        {loading && (
          <View className="self-start bg-neutral-800 p-3 rounded-2xl rounded-tl-sm mb-4">
            <ActivityIndicator color="#1CB0F6" />
          </View>
        )}
      </ScrollView>

      <View className="p-4 border-t border-neutral-800 flex-row items-center bg-neutral-900">
        <TextInput
          className="flex-1 bg-neutral-800 text-white p-3 rounded-full font-PlusJakartaSans mr-2"
          placeholder="Ask me anything..."
          placeholderTextColor="#A3A3A3"
          value={input}
          onChangeText={setInput}
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity
          className={`p-3 rounded-full ${input.trim() ? 'bg-primary' : 'bg-neutral-800'}`}
          onPress={sendMessage}
          disabled={!input.trim()}
        >
          <MaterialIcons name="send" size={24} color={input.trim() ? '#FFF' : '#A3A3A3'} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
