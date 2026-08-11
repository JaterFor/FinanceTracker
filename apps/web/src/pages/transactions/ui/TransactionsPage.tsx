import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useCategoriesQuery } from '../../../entities/category';
import { useSessionStore } from '../../../entities/session';
import { useDeleteTransactionMutation, useTransactionsQuery } from '../../../entities/transaction';
import { ExpenseChart } from '../../../features/expense-chart';
import { formatAmount, pushToast } from '../../../shared/lib';
import { CategoryIcon } from '../../../shared/ui';

export function TransactionsPage() {
  const { t } = useTranslation();
  const user = useSessionStore((state) => state.user);
  const logout = useSessionStore((state) => state.logout);
  const { data: transactions, isLoading } = useTransactionsQuery();
  const { data: categories } = useCategoriesQuery();
  const { mutate: deleteTransaction } = useDeleteTransactionMutation();
  const categoryById = new Map(categories?.map((category) => [category.id, category]));

  function handleDelete(id: string) {
    if (!window.confirm(t('transactions.confirmDelete'))) return;
    deleteTransaction(id, {
      onSuccess: () => pushToast('success', t('transactions.deleted')),
      onError: () => pushToast('error', t('transactions.deleteFailed')),
    });
  }

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

      <ExpenseChart transactions={transactions ?? []} categories={categories ?? []} />

      {isLoading ? (
        <p>{t('transactions.loading')}</p>
      ) : transactions?.length === 0 ? (
        <p className="chart-empty">{t('transactions.empty')}</p>
      ) : (
        <ul>
          {transactions?.map((transaction) => {
            const category = categoryById.get(transaction.categoryId);
            return (
              <li key={transaction.id} className="transaction-row">
                {category ? (
                  <span className="transaction-icon" style={{ backgroundColor: category.color }}>
                    <CategoryIcon name={category.icon} size={14} />
                  </span>
                ) : null}
                <span
                  className={transaction.type === 'income' ? 'amount-income' : 'amount-expense'}
                >
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatAmount(Math.abs(transaction.amount))}
                </span>
                <span className="transaction-note">
                  {transaction.note ?? t('transactions.noNote')}
                </span>
                <button
                  type="button"
                  className="transaction-delete"
                  onClick={() => handleDelete(transaction.id)}
                  aria-label={t('transactions.delete')}
                >
                  ✕
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <Link to="/add" className="fab" aria-label={t('addTransaction.add')}>
        +
      </Link>
    </main>
  );
}
