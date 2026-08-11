import { useTranslation } from 'react-i18next';
import { LoginForm } from '../../../features/login';

export function LoginPage() {
  const { t } = useTranslation();

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1>{t('auth.signInTitle')}</h1>
        <LoginForm />
      </div>
    </main>
  );
}
