import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { post } from '../lib/api';

export default function Screen14({ navigation, route }: any) {
  const { topic } = route.params || { topic: 'General Programming' };
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    setMessages([{ role: 'ai', content: `Hello! I am your AI Tutor for ${topic}. What concepts would you like to explore today?` }]);
  }, [topic]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await post('/api/chat', { message: input, context: topic });
      setMessages((prev) => [...prev, { role: 'ai', content: (response as any).message }]);
    } catch (e) {
      setMessages((prev) => [...prev, { role: 'ai', content: 'Oops, something went wrong. Let\'s try asking that differently.' }]);
    } finally {
      setLoading(false);
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#111827]">
      <View className="flex-row items-center p-4 border-b border-gray-800">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <MaterialIcons name="close" size={24} color="#FFF" />
        </TouchableOpacity>
        <View>
          <Text className="text-xl font-Fredoka-Medium text-white">AI Tutor</Text>
          <Text className="text-xs font-PlusJakartaSans text-gray-400">Context: {topic}</Text>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        className="flex-1 p-4"
        contentContainerStyle={{ paddingBottom: 20 }}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((msg, i) => (
          <View key={i} className={`mb-4 max-w-[85%] p-4 rounded-2xl ${msg.role === 'user' ? 'bg-[#58CC02] self-end rounded-tr-sm' : 'bg-gray-800 self-start rounded-tl-sm'}`}>
            <Text className="text-white font-PlusJakartaSans leading-5">{msg.content}</Text>
          </View>
        ))}
        {loading && (
          <View className="self-start bg-gray-800 p-4 rounded-2xl rounded-tl-sm mb-4 flex-row items-center">
             <ActivityIndicator color="#58CC02" size="small" className="mr-2" />
             <Text className="text-gray-400 font-PlusJakartaSans text-sm">Thinking...</Text>
          </View>
        )}
      </ScrollView>

      <View className="p-4 border-t border-gray-800 flex-row items-center bg-[#111827]">
        <TextInput
          className="flex-1 bg-gray-800 text-white p-3 px-5 rounded-full font-PlusJakartaSans mr-2 border border-gray-700 focus:border-[#58CC02]"
          placeholder="Ask a question about the lesson..."
          placeholderTextColor="#6B7280"
          value={input}
          onChangeText={setInput}
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity
          className={`w-12 h-12 rounded-full items-center justify-center ${input.trim() ? 'bg-[#58CC02]' : 'bg-gray-800'}`}
          onPress={sendMessage}
          disabled={!input.trim()}
        >
          <MaterialIcons name="send" size={20} color={input.trim() ? '#FFF' : '#6B7280'} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
