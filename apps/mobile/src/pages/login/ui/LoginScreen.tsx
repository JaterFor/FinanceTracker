import { useTranslation } from 'react-i18next';
import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LoginForm } from '../../../features/login';
import { colors } from '../../../shared/ui';

export function LoginScreen() {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>{t('auth.signInTitle')}</Text>
      <LoginForm />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16, gap: 16, backgroundColor: colors.background },
  title: { fontSize: 24, fontWeight: '600', color: colors.text },
});
