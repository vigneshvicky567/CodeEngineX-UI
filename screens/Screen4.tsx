import React from 'react';
import { View, Text, Pressable, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Svg, { Rect, Circle, Path } from 'react-native-svg';

const { height } = Dimensions.get('window');

export default function Screen4() {
  const navigation = useNavigation<any>();

  // BACKEND: POST /api/auth/login
  // Endpoint to authenticate an existing user.
  // Request body: { username/email, password }
  // Response: { token: string, user: object }
  const handleLogin = () => {
    // BACKEND INTEGRATION POINT:
    // try {
    //   const res = await axios.post('/api/auth/login', credentials);
    //   saveToken(res.data.token);
    // } catch (e) { ... }
    navigation.navigate('MainTabs');
  };

  // BACKEND: POST /api/auth/register
  // Endpoint to register a new user.
  // Request body: { username, email, password }
  // Response: { token: string, user: object }
  const handleSignUp = () => {
    navigation.navigate('PathSelection');
  };

  return (
    <SafeAreaView className="flex-1 bg-[#ffffff] items-center justify-center p-6 sm:p-8 relative overflow-hidden">
      <View className="w-full max-w-md mx-auto flex-col items-center justify-between h-full z-10" style={{ minHeight: height * 0.8 }}>

        {/* Top Section: Mascot & Branding */}
        <View className="flex-col items-center justify-center flex-1 w-full space-y-8 mt-12 mb-12">

          {/* Mascot SVG (Animated hover effect not directly translatable to RN without Reanimated, using static for now) */}
          <View className="w-[200px] h-[200px] relative flex items-center justify-center">
            <Svg className="w-full h-full drop-shadow-xl" fill="none" viewBox="0 0 200 200">
              <Rect fill="#1eb1f6" height="110" rx="30" width="100" x="50" y="60" />
              <Rect fill="#38bdf8" height="106" rx="30" width="100" x="50" y="60" />
              <Rect fill="#0f172a" height="50" rx="15" width="70" x="65" y="80" />
              <Circle cx="85" cy="105" fill="#a7f3d0" r="8" />
              <Circle cx="115" cy="105" fill="#a7f3d0" r="8" />
              <Path d="M 90 120 Q 100 125 110 120" fill="none" stroke="#a7f3d0" strokeLinecap="round" strokeWidth="3" />
              <Rect fill="#94a3b8" height="30" width="8" x="96" y="30" />
              <Circle cx="100" cy="25" fill="#fbbf24" r="12" />
              <Path d="M 50 110 Q 30 110 30 140" fill="none" stroke="#38bdf8" strokeLinecap="round" strokeWidth="16" />
              <Path d="M 150 110 Q 170 110 170 90" fill="none" stroke="#38bdf8" strokeLinecap="round" strokeWidth="16" />
              <Circle cx="30" cy="140" fill="#f8fafc" r="12" />
              <Circle cx="170" cy="90" fill="#f8fafc" r="12" />
            </Svg>
          </View>

          {/* Branding Title */}
          <Text className="text-[#4B4B4B] font-display font-extrabold text-[32px] leading-tight text-center px-4 tracking-tight mt-8">
            Learn to code.{'\n'}For real.
          </Text>
        </View>

        {/* Bottom Section: Login Actions */}
        <View className="w-full flex-col space-y-4 pb-8 gap-4">

          {/* Primary Login Button */}
          <Pressable
            onPress={handleLogin}
            className="w-full h-14 bg-[#1eb1f6] rounded-full flex-row items-center justify-center active:bg-[#1899D6] active:translate-y-1"
            style={{
              shadowColor: '#1899D6',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 1,
              shadowRadius: 0,
              elevation: 0,
            }}
          >
            <Text className="text-white font-bold text-lg">Log In</Text>
          </Pressable>

          /*{/* Divider */}
          <View className="flex-row items-center py-2">
            <View className="flex-1 border-t border-gray-200" />
            <Text className="mx-4 text-gray-400 font-medium text-sm">or</Text>
            <View className="flex-1 border-t border-gray-200" />
          </View>

          {/* Apple Login Button */}
          <Pressable
            className="w-full h-14 bg-white rounded-full border-2 border-gray-200 flex-row items-center justify-center relative active:bg-gray-50 active:translate-y-1"
            style={{
              shadowColor: '#E5E7EB',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 1,
              shadowRadius: 0,
              elevation: 0,
            }}
          >
            <View className="absolute left-6">
              <Svg className="w-6 h-6" fill="#4B4B4B" viewBox="0 0 24 24">
                <Path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.62-1.496 3.603-2.95 1.156-1.687 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.619 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.697.811-1.333 2.247-1.155 3.6 1.353.104 2.697-.578 3.441-1.587z" />
              </Svg>
            </View>
            <Text className="text-[#4B4B4B] font-bold text-base">Continue with Apple</Text>
          </Pressable>

          {/* Google Login Button */}
          <Pressable
            className="w-full h-14 bg-white rounded-full border-2 border-gray-200 flex-row items-center justify-center relative active:bg-gray-50 active:translate-y-1"
            style={{
              shadowColor: '#E5E7EB',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 1,
              shadowRadius: 0,
              elevation: 0,
            }}
          >
            <View className="absolute left-6">
              <Svg className="w-6 h-6" viewBox="0 0 24 24">
                <Path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <Path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <Path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <Path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </Svg>
            </View>
            <Text className="text-[#4B4B4B] font-bold text-base">Continue with Google</Text>
          </Pressable>

          */
          {/* Sign Up Link */}
          <Pressable
            onPress={handleSignUp}
            className="mt-6 pt-4 flex-row justify-center active:opacity-70"
          >
            <Text className="text-sm text-gray-500 font-medium">Don't have an account? </Text>
            <Text className="text-[#1eb1f6] font-bold">Sign Up</Text>
          </Pressable>
        </View>

      </View>
    </SafeAreaView>
  );
}
