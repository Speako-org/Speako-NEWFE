import React, { useState } from 'react';
import {
  SafeAreaView,
  KeyboardAvoidingView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  Image,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { AntDesign, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import GradientText from '../../components/GradientText';

const LoginScreen = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // const handleLogin = async () => {
  //   try {
  //     const response = await fetch('http://localhost:3000/api/auth/login', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         username: username,
  //         password: password,
  //       }),
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       // 로그인 성공 시 홈 화면으로 이동
  //       router.replace({
  //         pathname: '/(protected)/(tabs)/home',
  //       });
  //     } else {
  //       // 로그인 실패 시 에러 메시지 표시
  //       Alert.alert('로그인 실패', '아이디 또는 비밀번호를 확인해주세요.');
  //     }
  //   } catch (error) {
  //     console.error('Login error:', error);
  //     Alert.alert('오류', '로그인 중 문제가 발생했습니다.');
  //   }
  // };

  const handleLogin = () => {
    // 임시로 홈 화면으로 이동
    router.replace({
      pathname: '/(protected)/(tabs)/home',
    });
  };
  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View className="flex-1 justify-between px-6 pb-0 pt-24">
            <View>
              <View className="mb-3 mt-3 items-center">
                <GradientText text="환영합니다" style="text-2xl font-bold mb-1" />
                <Text className="mb-10 text-center text-base leading-7 text-gray-500">
                  계정에 로그인하세요
                </Text>
              </View>
              <View className="mb-20">
                <Text className="mb-3.5 text-sm font-medium text-gray-800">아이디</Text>
                <View className="mb-8 min-h-[50px] flex-row items-center border-b border-gray-200 pb-2">
                  <AntDesign name="user" size={20} color="#CECECE" className="mr-2.5" />
                  <TextInput
                    className="text-m flex-1 text-[#CECECE]"
                    placeholder="아이디를 입력하세요"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                  />
                </View>
                <Text className="mb-3.5 text-sm font-medium text-gray-800">비밀번호</Text>
                <View className="mb-6 min-h-[50px] flex-row items-center border-b border-gray-200 pb-2">
                  <AntDesign name="lock" size={20} color="#CECECE" className="mr-2.5" />
                  <TextInput
                    className="text-m flex-1 text-[#CECECE]"
                    placeholder="비밀번호를 입력하세요"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                  />
                </View>
                <View className="mb-1">
                  <View className="flex-row items-center justify-between">
                    <TouchableOpacity
                      className="flex-row items-center"
                      onPress={() => setRememberMe(!rememberMe)}>
                      <View
                        className={`mr-2 h-4 w-4 items-center justify-center rounded-md border border-gray-300 ${
                          rememberMe ? 'border-[#A8A3FF] bg-[#A8A3FF]' : ''
                        }`}>
                        {rememberMe && <Feather name="check" size={14} color="#FFFFFF" />}
                      </View>
                      <Text className="text-m text-gray-600">로그인 상태 유지</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <Text className="text-m mr-1.5 font-medium text-[#A8A3FF]">
                        비밀번호 찾기
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity
                  className="mt-12 h-[60px] overflow-hidden rounded-2xl"
                  onPress={handleLogin}>
                  <LinearGradient
                    colors={['#94A0FF', '#D2B6FF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="rounded- h-full items-center justify-center">
                    <Text className="text-center text-base font-bold text-white">로그인</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <View className="mt-4 flex-row justify-center">
                  <Text className="text-m font-medium text-gray-600">계정이 없으신가요?</Text>
                  <TouchableOpacity
                    onPress={() =>
                      router.replace({
                        pathname: '/(public)/signup',
                      })
                    }
                    className="ml-2">
                    <Text className="text-center text-[14px] text-[#8962c8]">회원가입</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View className="-mt-10 mb-10">
              <View className="mb-5 flex-row items-center">
                <View className="h-px flex-1 bg-gray-200" />
                <Text className="mx-2.5 text-sm text-gray-400">간편 로그인</Text>
                <View className="h-px flex-1 bg-gray-200" />
              </View>
              <TouchableOpacity className="h-14 flex-row items-center justify-center rounded-lg bg-[#FEE500]">
                <Image
                  source={require('../../assets/pngwing.com.png')}
                  style={{ width: 18, height: 18, marginRight: 10 }}
                />
                <Text className="text-sm font-semibold text-gray-700">카카오로 시작하기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
