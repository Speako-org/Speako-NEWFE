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
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { AntDesign, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import GradientText from '../../components/GradientText';

const LoginScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleLogin = async () => {
    setErrors({});
    setIsLoading(true);
    try {
      // 유효성 검사
      if (!email) {
        setErrors((prev) => ({ ...prev, email: '이메일을 입력하세요' }));
        setIsLoading(false);
        return;
      }
      if (!password) {
        setErrors((prev) => ({ ...prev, password: '비밀번호를 입력하세요' }));
        setIsLoading(false);
        return;
      }
      const response = await fetch('https://speako.site/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        // 로그인 성공 시 홈 화면으로 이동
        router.replace({ pathname: '/(protected)/(tabs)/home' });
      } else {
        const data = await response.json();
        // 백엔드에서 에러 메시지에 따라 분기
        if (data.message && data.message.includes('not found')) {
          setErrors((prev) => ({ ...prev, email: '등록된 회원이 아닙니다' }));
        } else if (data.message && data.message.includes('password')) {
          setErrors((prev) => ({ ...prev, password: '올바른 비밀번호가 아닙니다' }));
        } else {
          Alert.alert('로그인 실패', '아이디 또는 비밀번호를 확인해주세요.');
        }
      }
    } catch (error) {
      console.error(error);
      Alert.alert('오류', '로그인 중 문제가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
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
                <GradientText text="환영합니다" style="text-3xl font-bold mb-1" />
                <Text className="mb-10 text-center text-base leading-7 text-gray-500">
                  계정에 로그인하세요
                </Text>
              </View>
              <View className="mb-20">
                <View className="flex-row items-center justify-between">
                  <Text className="mb-3.5 mt-1 text-sm font-medium text-gray-800">아이디</Text>
                  {errors.email && <Text className="text-xs text-red-500">{errors.email}</Text>}
                </View>
                <View className="mb-8 min-h-[50px] flex-row items-center border-b border-gray-200 pb-2">
                  <AntDesign name="user" size={20} color="#CECECE" className="mr-2.5" />
                  <TextInput
                    className="text-m flex-1 text-[#333]"
                    placeholder="아이디를 입력하세요"
                    placeholderTextColor="#CECECE"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                  />
                </View>
                <View className="flex-row items-center justify-between">
                  <Text className="mb-3.5 text-sm font-medium text-gray-800">비밀번호</Text>
                  {errors.password && (
                    <Text className="text-xs text-red-500">{errors.password}</Text>
                  )}
                </View>
                <View className="mb-6 min-h-[50px] flex-row items-center border-b border-gray-200 pb-2">
                  <AntDesign name="lock" size={20} color="#CECECE" className="mr-2.5" />
                  <TextInput
                    className="text-m flex-1 text-[#333]"
                    placeholder="비밀번호를 입력하세요"
                    placeholderTextColor="#CECECE"
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
                  style={{
                    height: 50,
                    width: '100%',
                    borderRadius: 10,
                    overflow: 'hidden',
                    marginTop: 48,
                  }}
                  onPress={handleLogin}
                  disabled={isLoading}>
                  <LinearGradient
                    colors={['#94A0FF', '#D2B6FF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      height: 50,
                      width: '100%',
                      borderRadius: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>로그인</Text>
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
