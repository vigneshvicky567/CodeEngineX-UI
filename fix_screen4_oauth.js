const fs = require('fs');
let file = fs.readFileSync('screens/Screen4.tsx', 'utf8');

file = file.replace(
`          {/* Apple Login Button */}
          <Pressable
            className="w-full h-14 bg-white rounded-full border-2 border-gray-200 flex-row items-center justify-center relative active:bg-gray-50 active:translate-y-1"`,
`          {/* Apple Login Button - COMMENTED OUT AS PER REQUEST
          <Pressable
            className="w-full h-14 bg-white rounded-full border-2 border-gray-200 flex-row items-center justify-center relative active:bg-gray-50 active:translate-y-1"`
);

file = file.replace(
`            <Text className="text-[#4B4B4B] font-bold text-base">Continue with Apple</Text>
          </Pressable>`,
`            <Text className="text-[#4B4B4B] font-bold text-base">Continue with Apple</Text>
          </Pressable>
          */}`
);

file = file.replace(
`          {/* Google Login Button */}
          <Pressable
            className="w-full h-14 bg-white rounded-full border-2 border-gray-200 flex-row items-center justify-center relative active:bg-gray-50 active:translate-y-1"`,
`          {/* Google Login Button - COMMENTED OUT AS PER REQUEST
          <Pressable
            className="w-full h-14 bg-white rounded-full border-2 border-gray-200 flex-row items-center justify-center relative active:bg-gray-50 active:translate-y-1"`
);

file = file.replace(
`            <Text className="text-[#4B4B4B] font-bold text-base">Continue with Google</Text>
          </Pressable>`,
`            <Text className="text-[#4B4B4B] font-bold text-base">Continue with Google</Text>
          </Pressable>
          */}`
);

fs.writeFileSync('screens/Screen4.tsx', file);
