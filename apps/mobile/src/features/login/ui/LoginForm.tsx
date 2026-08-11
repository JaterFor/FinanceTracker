import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../../../shared/ui';
import { useLogin } from '../model/use-login';

export function LoginForm() {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { mutate, isPending, error } = useLogin();

  return (
    <View style={styles.form}>
      <TextInput
        placeholder={t('auth.username')}
        placeholderTextColor={colors.textMuted}
        autoCapitalize="none"
        value={username}
        onChangeText={setUsername}
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
        onPress={() => mutate({ username, password })}
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
