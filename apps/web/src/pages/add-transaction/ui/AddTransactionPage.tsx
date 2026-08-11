import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { AddTransactionForm } from '../../../features/add-transaction';

export function AddTransactionPage() {
  const { t } = useTranslation();

  return (
    <main>
      <header className="page-header-with-back">
        <Link to="/" className="back-link" aria-label={t('addTransaction.back')}>
          ←
        </Link>
        <h1>{t('addTransaction.title')}</h1>
      </header>

      <AddTransactionForm />
    </main>
  );
}
