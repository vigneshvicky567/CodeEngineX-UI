import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const options = [
  { id: 0, text: '"Hello"', isCorrect: false },
  { id: 1, text: '42', isCorrect: false },
  { id: 2, text: 'true', isCorrect: true },
  { id: 3, text: '[1, 2]', isCorrect: false },
];

export default function Screen8() {
  const navigation = useNavigation<any>();
  const [selectedOption, setSelectedOption] = useState<number | null>(2); // pre-selecting Option 3 ("true")
  const [isChecked, setIsChecked] = useState(false);

  // BACKEND: GET /api/quizzes/{quizId}
  // Endpoint to fetch quiz questions and options.
  // Response: { question: string, options: Array<{ id: number, text: string }> }
  /*
  useEffect(() => {
    // const data = await axios.get(`/api/quizzes/${quizId}`);
    // setQuizData(data);
  }, []);
  */

  // BACKEND: POST /api/quizzes/{quizId}/submit
  // Endpoint to evaluate the selected answer and award XP.
  // Request body: { userId: string, answerId: number }
  // Response: { isCorrect: boolean, correctAnswerId: number, xpEarned: number }
  const handleCheck = () => {
    if (!isChecked) {
      // BACKEND INTEGRATION POINT:
      // const res = await axios.post(`/api/quizzes/${quizId}/submit`, { answerId: selectedOption });
      // setIsCorrect(res.data.isCorrect);
      setIsChecked(true);
    } else {
        navigation.navigate('MobileIDE');
    }
  };

  const currentOption = selectedOption !== null ? options.find(opt => opt.id === selectedOption) : null;
  const showSuccess = isChecked && currentOption?.isCorrect; // Update to use backend result state
  const showError = isChecked && !currentOption?.isCorrect; // Update to use backend result state

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Top Navigation / Progress */}
      <View className="flex-row items-center justify-between p-4 bg-white z-10 shrink-0">
        <Pressable onPress={() => navigation.goBack()} className="w-10 h-10 items-center justify-center rounded-full">
          <MaterialIcons name="close" size={28} color="#AFAFAF" />
        </Pressable>
        <View className="flex-1 mx-4">
          <View className="h-4 bg-[#F7F7F9] rounded-full overflow-hidden">
            <View className="h-full bg-[#58CC02] rounded-full w-[70%]" />
          </View>
        </View>
        <View className="flex-row items-center gap-1">
          <MaterialIcons name="favorite" size={24} color="#FF4B4B" />
          <Text className="font-bold text-[#FF4B4B] text-lg">4</Text>
        </View>
      </View>

      {/* Main Content Area */}
      <View className="flex-1 px-4 pt-4 pb-32 flex-col max-w-lg mx-auto w-full">
        <View className="mb-8 mt-4">
          <Text className="text-2xl font-bold text-[#4B4B4B] leading-tight font-display">
            Tap the boolean value
          </Text>
        </View>

        {/* Options Grid */}
        <View className="flex-row flex-wrap justify-between mt-auto mb-auto gap-y-4">
          {options.map((opt) => {
            const isSelected = selectedOption === opt.id;
            return (
              <Pressable
                key={opt.id}
                onPress={() => !isChecked && setSelectedOption(opt.id)}
                className={`w-[48%] h-32 flex-col items-center justify-center p-4 rounded-xl border-2 active:translate-y-1 ${
                  isSelected
                    ? 'border-[#1eb1f6] bg-[#1eb1f6]/10'
                    : 'border-[#E5E5E5] bg-white'
                }`}
                style={{
                  shadowColor: isSelected ? '#1eb1f6' : '#E5E5E5',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 1,
                  shadowRadius: 0,
                  elevation: 0,
                }}
              >
                <Text className={`text-xl font-code ${isSelected ? 'font-bold text-[#1eb1f6]' : 'font-medium text-[#4B4B4B]'}`}>
                  {opt.text}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Bottom Action Area */}
      {!isChecked ? (
        <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#F7F7F9] p-4 pb-8 z-20">
          <View className="max-w-lg mx-auto w-full">
            <Pressable
              onPress={handleCheck}
              className="w-full h-14 bg-[#1eb1f6] rounded-full flex-row items-center justify-center active:translate-y-1"
              style={{ shadowColor: '#1899D6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 0 }}
            >
              <Text className="text-white font-bold text-lg uppercase tracking-wider">Check</Text>
            </Pressable>
          </View>
        </View>
      ) : showSuccess ? (
        <View className="absolute bottom-0 left-0 right-0 z-30 bg-[#58CC02] p-6 pb-10 rounded-t-3xl">
          <View className="flex-row items-center gap-4 mb-6">
            <View className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0">
              <MaterialIcons name="check-circle" size={32} color="#58CC02" />
            </View>
            <View className="flex-col">
              <Text className="text-2xl font-bold text-white font-display">Excellent!</Text>
              <Text className="text-white/90 font-medium font-display">You identified the boolean.</Text>
            </View>
          </View>
          <Pressable
            onPress={handleCheck}
            className="w-full h-14 bg-white rounded-full flex-row items-center justify-center active:translate-y-1"
            style={{ shadowColor: '#E5E5E5', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 0 }}
          >
            <Text className="text-[#58CC02] font-bold text-lg uppercase tracking-wider font-display">Continue</Text>
          </Pressable>
        </View>
      ) : (
        <View className="absolute bottom-0 left-0 right-0 z-30 bg-[#FF4B4B] p-6 pb-10 rounded-t-3xl">
          <View className="flex-row items-center gap-4 mb-6">
            <View className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0">
              <MaterialIcons name="cancel" size={32} color="#FF4B4B" />
            </View>
            <View className="flex-col">
              <Text className="text-2xl font-bold text-white font-display">Not quite!</Text>
              <View className="bg-black/10 px-2 py-1 rounded self-start mt-1">
                <Text className="text-white/90 font-medium font-code">Correct answer: true</Text>
              </View>
            </View>
          </View>
          <Pressable
            onPress={() => setIsChecked(false)}
            className="w-full h-14 bg-white rounded-full flex-row items-center justify-center active:translate-y-1"
            style={{ shadowColor: '#E5E5E5', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 0 }}
          >
            <Text className="text-[#FF4B4B] font-bold text-lg uppercase tracking-wider font-display">Got it</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}
