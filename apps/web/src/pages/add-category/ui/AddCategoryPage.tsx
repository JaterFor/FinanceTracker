import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { AddCategoryForm } from '../../../features/add-category';

export function AddCategoryPage() {
  const { t } = useTranslation();

  return (
    <main>
      <header className="page-header-with-back">
        <Link to="/add" className="back-link" aria-label={t('addCategory.back')}>
          ←
        </Link>
        <h1>{t('addCategory.title')}</h1>
      </header>

      <AddCategoryForm />
    </main>
  );
}
