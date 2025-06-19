import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';

const KakaoCallback = () => {
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleKakaoCallback = async () => {
      try {
        // URL 파라미터에서 access_token 확인
        const accessToken = searchParams.access_token as string;
        const error = searchParams.error as string;

        if (error) {
          setError('로그인에 실패했습니다.');
          return;
        }

        if (accessToken) {
          // 토큰 저장
          await storeToken(accessToken);
          router.replace('/(protected)/(tabs)/home' as any);
        } else {
          // 토큰이 없는 경우
          setError('인증 정보를 찾을 수 없습니다.');
        }
      } catch (error) {
        console.error('Kakao callback error:', error);
        setError('로그인 처리 중 오류가 발생했습니다.');
      }
    };

    handleKakaoCallback();
  }, [searchParams, router]);

  const storeToken = async (token: string) => {
    try {
      // Expo SecureStore에 저장 (암호화된 저장소)
      await SecureStore.setItemAsync('accessToken', token);

      // 웹 환경에서도 지원
      if (typeof window !== 'undefined') {
        // localStorage와 sessionStorage에 저장
        localStorage.setItem('accessToken', token);
        sessionStorage.setItem('accessToken', token);

        // 쿠키에도 저장
        document.cookie = `accessToken=${token}; path=/; SameSite=None; Secure`;
      }

      console.log('Kakao token stored successfully');
    } catch (error) {
      console.error('Error storing token:', error);
      throw error;
    }
  };

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center px-6">
          <Text className="mb-4 text-center text-red-500">{error}</Text>
          <Text
            className="text-[#A8A3FF] underline"
            onPress={() => router.replace('/(public)/login' as any)}>
            로그인 페이지로 돌아가기
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return null;
};

export default KakaoCallback;
