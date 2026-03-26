const fs = require('fs');

let file = fs.readFileSync('screens/Screen4.tsx', 'utf8');

file = file.replace(
`          <Pressable
            onPress={handleLogin}
            className="w-full h-14 bg-[#1eb1f6] rounded-full flex-row items-center justify-center active:bg-[#1899D6] active:translate-y-1"`,
`          <Pressable
            onPress={handleLogin}
            disabled={isLoading}
            className={\`w-full h-14 bg-[#1eb1f6] rounded-full flex-row items-center justify-center active:bg-[#1899D6] active:translate-y-1 \${isLoading ? 'opacity-70' : ''}\`}`
);

file = file.replace(
`<Text className="text-white font-bold text-lg">Log In</Text>`,
`<Text className="text-white font-bold text-lg">{isLoading ? 'Loading...' : 'Log In'}</Text>`
);

fs.writeFileSync('screens/Screen4.tsx', file);
