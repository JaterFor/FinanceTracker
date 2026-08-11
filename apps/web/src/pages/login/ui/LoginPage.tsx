import { useTranslation } from 'react-i18next';
import { LoginForm } from '../../../features/login';

export function LoginPage() {
  const { t } = useTranslation();

  return (
    <main>
      <h1>{t('auth.signInTitle')}</h1>
      <LoginForm />
    </main>
  );
}
