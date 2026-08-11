import { type FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLogin } from '../model/use-login';

export function LoginForm() {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { mutate, isPending, error } = useLogin();

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    mutate({ username, password });
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        {t('auth.username')}
        <input
          type="text"
          autoCapitalize="none"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
        />
      </label>
      <label>
        {t('auth.password')}
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </label>
      <button type="submit" disabled={isPending}>
        {isPending ? t('auth.signingIn') : t('auth.signIn')}
      </button>
      {error ? <p role="alert">{error.message}</p> : null}
    </form>
  );
}
