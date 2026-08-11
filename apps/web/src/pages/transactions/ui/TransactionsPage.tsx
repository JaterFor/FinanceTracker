import { useTranslation } from 'react-i18next';
import { useCategoriesQuery } from '../../../entities/category';
import { useSessionStore } from '../../../entities/session';
import { useTransactionsQuery } from '../../../entities/transaction';
import { AddTransactionForm } from '../../../features/add-transaction';

export function TransactionsPage() {
  const { t } = useTranslation();
  const user = useSessionStore((state) => state.user);
  const logout = useSessionStore((state) => state.logout);
  const { data: transactions, isLoading } = useTransactionsQuery();
  const { data: categories } = useCategoriesQuery();
  const categoryById = new Map(categories?.map((category) => [category.id, category]));

  return (
    <main>
      <header>
        <h1>{t('transactions.title')}</h1>
        <p>
          {user?.username}{' '}
          <button type="button" onClick={logout}>
            {t('transactions.signOut')}
          </button>
        </p>
      </header>

      <AddTransactionForm />

      {isLoading ? (
        <p>{t('transactions.loading')}</p>
      ) : (
        <ul>
          {transactions?.map((transaction) => {
            const category = categoryById.get(transaction.categoryId);
            return (
              <li key={transaction.id}>
                {category ? (
                  <span className="transaction-icon" style={{ backgroundColor: category.color }}>
                    {category.icon}
                  </span>
                ) : null}
                {transaction.type === 'income' ? '+' : '-'}
                {(transaction.amount / 100).toFixed(2)} —{' '}
                {transaction.note ?? t('transactions.noNote')}
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
