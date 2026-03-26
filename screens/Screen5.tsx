import React from 'react';
import { View, Text, Pressable, ScrollView, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../lib/api';
import { useLessonStore } from '../store/lessonStore';
import { useRoute } from '@react-navigation/native';

export default function Screen5() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [lessonData, setLessonData] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const { currentLessonId, assessmentId } = useLessonStore();

  React.useEffect(() => {
    async function loadLesson() {
      try {
        const targetId = route.params?.assessmentId || assessmentId;
        if (!targetId) return;

        // BACKEND INTEGRATION POINT:
        // const data = await api.get(`/api/v1/grammar/assessments/${targetId}`);
        // setLessonData(data);

        await new Promise(resolve => setTimeout(resolve, 500));
        setLessonData({
          title: "Epic Intro to Python",
          description: "We're diving into the snake-pit! Learn why Python is the coolest language for beginners and pro hackers alike.",
          xp: 50,
          badge: "Snake Charmer"
        });
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    loadLesson();
  }, [assessmentId, route.params]);

  const handleContinue = () => {
    navigation.navigate('LessonQuiz');
  };

  return (
    <SafeAreaView className="flex-1 bg-surface pb-24">
      {/* TopAppBar */}
      <View className="flex-row justify-between items-center px-6 py-4 w-full bg-[#f2f7ff] z-50">
        <View className="flex-row items-center gap-4">
          <Pressable
            onPress={() => navigation.goBack()}
            className="active:opacity-80"
          >
            <MaterialIcons name="arrow-back" size={32} color="#1CB0F6" />
          </Pressable>
          <Text className="font-headline font-bold text-2xl text-[#1CB0F6]">Lesson 1: Intro</Text>
        </View>
        <View className="flex-row items-center gap-4">
          <View className="flex-row items-center gap-1 px-3 py-1 bg-surface-container rounded-full">
            <Text className="text-xl">🔥</Text>
            <Text className="font-headline font-bold text-on-surface">12</Text>
          </View>
          <View className="flex-row items-center gap-1 px-3 py-1 bg-surface-container rounded-full">
            <MaterialIcons name="favorite" size={24} color="#ef4444" />
            <Text className="font-headline font-bold text-on-surface">5</Text>
          </View>
        </View>
      </View>
      <View className="bg-[#d9eaff] h-1 w-full" />

      <ScrollView className="max-w-2xl mx-auto px-4 pt-6 space-y-8 w-full">
        {/* Video Player Section */}
        <View className="relative group mb-8">
          <View className="aspect-video w-full rounded-lg overflow-hidden bg-inverse-surface shadow-lg relative">
            <Image
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnQvzfqc4tBwE_PQYfSu2_nFMi3QLGpE9JW5oyNHp8BlMgxpYQsC2glOB_7KGobnHH_9MQ26FEx0e61AetrKsNrge9bdbZTbG1RIw0aDOnVW14DQ9_DnFIDiu9Tk4ohHmcHQPlUqwJ0ENxulpjdKZe3gkh5OaxNv8Bdg92oqBIr4xweN8Cxg8doKMNMr91rkcBO69nsFoN6VBcJqDXII-7r0JNP4h2H0uShkpo09xVyHwiTZq5cghr1sLXgBlubsPdzchTEHpHevo' }}
              className="w-full h-full opacity-60"
            />
            {/* Large Yellow Play Button Overlay */}
            <Pressable
              className="absolute top-1/2 left-1/2 -ml-12 -mt-12 w-24 h-24 rounded-full flex-row items-center justify-center bg-tertiary-fixed active:translate-y-1"
              style={{
                shadowColor: '#edba00',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 1,
                shadowRadius: 0,
                elevation: 0,
              }}
            >
              <MaterialIcons name="play-arrow" size={64} color="white" />
            </Pressable>
            {/* Video Controls Bar */}
            <View className="absolute bottom-4 left-4 right-4 flex-row items-center gap-4 px-4 py-2 bg-black/40 rounded-xl">
              <MaterialIcons name="pause" size={24} color="white" />
              <View className="flex-1 h-2 bg-white/20 rounded-full relative justify-center">
                <View className="absolute left-0 w-1/3 h-full bg-secondary-fixed rounded-full" />
                <View className="absolute left-1/3 -ml-2 w-4 h-4 bg-white rounded-full shadow-lg" />
              </View>
              <Text className="text-white font-label text-xs">04:20 / 12:00</Text>
              <MaterialIcons name="fullscreen" size={24} color="white" />
            </View>
          </View>
        </View>

        {/* Content Area */}
        <View className="space-y-6 mb-8 gap-6">
          <View className="space-y-2 gap-2">
            <View className="flex-row items-center gap-2">
              <View className="px-3 py-1 bg-tertiary-container rounded-full">
                <Text className="text-on-tertiary-container text-xs font-bold font-label">BASIC PYTHON</Text>
              </View>
              <View className="px-3 py-1 bg-surface-container-highest rounded-full">
                <Text className="text-primary font-bold text-xs font-label">LEVEL 1</Text>
              </View>
            </View>
            <Text className="font-headline text-4xl text-on-surface tracking-tight">{lessonData?.title || '...'}</Text>
          </View>

          {/* Bento Description Cards */}
          <View className="flex-col md:flex-row gap-4">
            <View className="bg-surface-container-lowest p-6 rounded-lg space-y-3 relative overflow-hidden mb-4 border-b-4 border-surface-container gap-3">
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-xl bg-primary-container flex-row items-center justify-center">
                  <MaterialIcons name="lightbulb" size={24} color="#00324a" />
                </View>
                <Text className="font-headline text-xl text-on-surface">What's in this lesson?</Text>
              </View>
              <Text className="text-on-surface-variant font-body leading-relaxed">
                {lessonData?.description || '...'}
              </Text>
            </View>

            <View className="bg-surface-container-lowest p-6 rounded-lg space-y-3 border-b-4 border-surface-container gap-3">
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-xl bg-secondary-container flex-row items-center justify-center">
                  <MaterialIcons name="military-tech" size={24} color="#245c00" />
                </View>
                <Text className="font-headline text-xl text-on-surface">Rewards</Text>
              </View>
              <View className="space-y-2 gap-2">
                <View className="flex-row items-center gap-2">
                  <Text className="text-tertiary-fixed">✦</Text>
                  <Text className="text-on-surface-variant text-sm font-medium">{lessonData?.xp || 0} Experience Points</Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <Text className="text-secondary">✦</Text>
                  <Text className="text-on-surface-variant text-sm font-medium">"{lessonData?.badge || 'None'}" Badge</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Learning Path Hint */}
          <View className="bg-surface-container-low p-4 rounded-xl flex-row items-center gap-4">
            <Image
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACijBJ8Ajeh2C3o3-_Go55Okpn77nW1L7v1JYjiV89Mmt12sEZpHZw_-d4CLIN_1iGCTHPL3SiD0gDWFEMhH0QuNnLOqVI32VyVnwCCP8YcLYWt0vfRSTqOHChOubCX2sFFglV0cx9RMul1H8tRbrLIkce541zst9akbU3GwHo4nZXw8w3lgGZ5z5HOoHiKKkaooF7fCj9z_JgBQQx0rwJKZEcbcHcH50Ac4IzLaxcJQB-LonP42kdwxbZ6zIPvFWW1QIAnXQ3ZXM' }}
              className="w-16 h-16 rounded-full border-4 border-white"
            />
            <View className="flex-1">
              <Text className="text-on-surface font-medium text-sm italic">"Don't worry about the semicolons—Python doesn't need them! It's as easy as writing a grocery list!"</Text>
            </View>
          </View>
        </View>

        {/* Action Button */}
        <View className="pt-4 mb-8">
          <Pressable
            onPress={handleContinue}
            className="w-full py-5 rounded-lg bg-[#58CC02] flex-row items-center justify-center gap-3 active:translate-y-1"
            style={{
              shadowColor: '#46a302',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 1,
              shadowRadius: 0,
              elevation: 0,
            }}
          >
            <Text className="text-white font-headline text-xl">Continue to Quiz</Text>
            <MaterialIcons name="chevron-right" size={24} color="white" />
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
