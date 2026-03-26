const fs = require('fs');
let file = fs.readFileSync('screens/Screen12.tsx', 'utf8');

if (!file.includes('import api from \'../lib/api\';')) {
    file = file.replace(
      `import { SafeAreaView } from 'react-native-safe-area-context';`,
      `import { SafeAreaView } from 'react-native-safe-area-context';\nimport api from '../lib/api';\nimport { useEditorStore } from '../store/editorStore';\nimport Toast from 'react-native-toast-message';`
    );

    file = file.replace(
      `  const [output, setOutput] = useState('Hello World!');`,
      `  const { code, setCode, output, setOutput } = useEditorStore();\n  const [isLoading, setIsLoading] = useState(false);`
    );

    file = file.replace(
      `  const [code, setCode] = useState('let greeting = "Hello World!";\\nconsole.log(greeting);');\n`,
      ``
    );

    file = file.replace(
`  // BACKEND: POST /api/code/execute
  // Endpoint to safely compile/execute user code within a secure backend sandbox (e.g., using Docker or a serverless function).
  // Request body: { userId: string, code: string, language: 'javascript' | 'python' | etc. }
  // Response: { output: string, error: string | null, isCorrect: boolean }
  const handleRunCode = () => {
    // BACKEND INTEGRATION POINT:
    // try {
    //   const res = await axios.post('/api/code/execute', { code, language: 'javascript' });
    //   setOutput(res.data.output || res.data.error);
    //   if (res.data.isCorrect) {
    //      // Handle success
    //   }
    // } catch (e) { ... }
    setShowConsole(true);
  };`,
`  const handleRunCode = async () => {
    setIsLoading(true);
    setShowConsole(true);
    setOutput('Running...');
    try {
      // BACKEND INTEGRATION POINT: Code execution
      // const res = await api.post('/api/v1/run', { source_code: code, language_id: 63 });
      // setOutput(res.stdout || res.stderr || 'Execution finished');

      await new Promise(resolve => setTimeout(resolve, 800));
      setOutput('Hello World!\\nExecution finished in 0.02s');
    } catch (e: any) {
      setOutput(e.response?.data?.error || 'Execution failed');
      Toast.show({ type: 'error', text1: 'Execution failed' });
    } finally {
      setIsLoading(false);
    }
  };`
    );

    file = file.replace(
`          <Pressable
            onPress={handleRunCode}
            className="absolute bottom-24 right-6 w-16 h-16 bg-success rounded-full items-center justify-center z-30 active:scale-95"`,
`          <Pressable
            onPress={handleRunCode}
            disabled={isLoading}
            className={\`absolute bottom-24 right-6 w-16 h-16 bg-success rounded-full items-center justify-center z-30 active:scale-95 \${isLoading ? 'opacity-50' : ''}\`}`
    );
}

fs.writeFileSync('screens/Screen12.tsx', file);
