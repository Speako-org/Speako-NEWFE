import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView, Text, StyleSheet } from 'react-native';

export default function SocialDetailScreen() {
  const params = useLocalSearchParams();
  const { id } = params as { id: string };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Text>소셜 상세 스크린 {id}</Text>
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
