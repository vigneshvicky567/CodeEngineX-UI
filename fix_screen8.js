const fs = require('fs');
let file = fs.readFileSync('screens/Screen8.tsx', 'utf8');

if (!file.includes('import api from \'../lib/api\';')) {
    file = file.replace(
      `import { SafeAreaView } from 'react-native-safe-area-context';`,
      `import { SafeAreaView } from 'react-native-safe-area-context';\nimport api from '../lib/api';\nimport { useLessonStore } from '../store/lessonStore';\nimport Toast from 'react-native-toast-message';`
    );

    file = file.replace(
      `  const navigation = useNavigation<any>();`,
      `  const navigation = useNavigation<any>();\n  const { assessmentId, attemptId, setAttemptId } = useLessonStore();\n  const [isLoading, setIsLoading] = React.useState(false);\n  const [quizData, setQuizData] = React.useState<any>(null);\n  const [isCorrect, setIsCorrect] = React.useState<boolean | null>(null);`
    );

    file = file.replace(
`  // BACKEND: GET /api/quizzes/{quizId}
  // Endpoint to fetch quiz questions and options.
  // Response: { question: string, options: Array<{ id: number, text: string }> }
  /*
  useEffect(() => {
    // const data = await axios.get(\`/api/quizzes/\${quizId}\`);
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
      // const res = await axios.post(\`/api/quizzes/\${quizId}/submit\`, { answerId: selectedOption });
      // setIsCorrect(res.data.isCorrect);
      setIsChecked(true);
    } else {
        navigation.navigate('MobileIDE');
    }
  };`,
`  React.useEffect(() => {
    async function startAttempt() {
      if (!assessmentId) return;
      try {
        // BACKEND INTEGRATION POINT: Start attempt
        // const attempt = await api.post(\`/api/v1/grammar/assessments/\${assessmentId}/attempts\`);
        // setAttemptId(attempt.id);
        // setQuizData(attempt.firstQuestion);

        await new Promise(resolve => setTimeout(resolve, 300));
        setAttemptId('dummy-attempt-123');
        setQuizData({
            question: "Tap the boolean value",
            options: [
              { id: 0, text: '"Hello"' },
              { id: 1, text: '42' },
              { id: 2, text: 'true' },
              { id: 3, text: '[1, 2]' },
            ]
        });
      } catch (e) {
        console.error("Failed to start attempt", e);
      }
    }
    startAttempt();
  }, [assessmentId]);

  const handleCheck = async () => {
    if (!isChecked) {
      if (selectedOption === null) return;
      setIsLoading(true);
      try {
        // BACKEND INTEGRATION POINT: Submit answer
        // const res = await api.post(\`/api/v1/.../attempts/\${attemptId}/answers\`, {
        //   question_id: quizData.id,
        //   selected_option_id: selectedOption
        // });
        // setIsCorrect(res.isCorrect);

        await new Promise(resolve => setTimeout(resolve, 300));
        setIsCorrect(selectedOption === 2);
        setIsChecked(true);
      } catch (e) {
        Toast.show({ type: 'error', text1: 'Error submitting answer' });
      } finally {
        setIsLoading(false);
      }
    } else {
      if (isCorrect) {
          // In a real app we might fetch the next question here, or navigate to finish
          navigation.navigate('MobileIDE');
      } else {
          setIsChecked(false);
          setSelectedOption(null);
      }
    }
  };`
    );

    file = file.replace(
`  const currentOption = selectedOption !== null ? options.find(opt => opt.id === selectedOption) : null;
  const showSuccess = isChecked && currentOption?.isCorrect; // Update to use backend result state
  const showError = isChecked && !currentOption?.isCorrect; // Update to use backend result state`,
`  const showSuccess = isChecked && isCorrect;
  const showError = isChecked && !isCorrect;

  const displayOptions = quizData?.options || options;`
    );

    file = file.replace(
`          <Text className="text-2xl font-bold text-[#4B4B4B] leading-tight font-display">
            Tap the boolean value
          </Text>`,
`          <Text className="text-2xl font-bold text-[#4B4B4B] leading-tight font-display">
            {quizData?.question || 'Loading question...'}
          </Text>`
    );

    file = file.replace(
`          {options.map((opt) => {`,
`          {displayOptions.map((opt: any) => {`
    );

    file = file.replace(
`            <Pressable
              onPress={handleCheck}
              className="w-full h-14 bg-[#1eb1f6] rounded-full flex-row items-center justify-center active:translate-y-1"`,
`            <Pressable
              onPress={handleCheck}
              disabled={isLoading}
              className={\`w-full h-14 bg-[#1eb1f6] rounded-full flex-row items-center justify-center active:translate-y-1 \${isLoading ? 'opacity-70' : ''}\`}`
    );
}

fs.writeFileSync('screens/Screen8.tsx', file);
