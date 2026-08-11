import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../../../shared/ui';
import { useLogin } from '../model/use-login';

export function LoginForm() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { mutate, isPending, error } = useLogin();

  return (
    <View style={styles.form}>
      <TextInput
        placeholder={t('auth.email')}
        placeholderTextColor={colors.textMuted}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder={t('auth.password')}
        placeholderTextColor={colors.textMuted}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      <Button
        title={isPending ? t('auth.signingIn') : t('auth.signIn')}
        color={colors.primary}
        disabled={isPending}
        onPress={() => mutate({ email, password })}
      />
      {error ? <Text style={styles.error}>{error.message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: 12 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  error: { color: colors.danger },
});
