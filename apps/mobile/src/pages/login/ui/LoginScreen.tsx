import { SafeAreaView, StyleSheet, Text } from 'react-native';
import { LoginForm } from '../../../features/login';

export function LoginScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>Sign in</Text>
      <LoginForm />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16, gap: 16 },
  title: { fontSize: 24, fontWeight: '600' },
});
