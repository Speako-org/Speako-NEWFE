import { router, Stack } from 'expo-router';
import { Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function SocialLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="[id]"
        options={{
          title: '소셜 상세 페이지',
          headerShown: true,
          headerLeft: () => (
            <Pressable onPress={() => router.back()}>
              <Feather name="arrow-left" size={24} color={'#000'} />
            </Pressable>
          ),
        }}
      />
    </Stack>
  );
}
