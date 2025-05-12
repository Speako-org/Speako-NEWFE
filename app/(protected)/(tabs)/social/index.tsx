import { useRouter } from 'expo-router';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function SocialScreen() {
  const router = useRouter();

  const handleMoveSocialDetailScreen = () => {
    router.push({
      pathname: '/social/[id]',
      params: { id: 1 },
    });
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Text>소셜 스크린 index</Text>
        <Pressable onPress={handleMoveSocialDetailScreen}>
          <View className="border-1 bg-red-50 p-4">
            <Text>소셜 게시글 입니다.</Text>
          </View>
        </Pressable>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});
