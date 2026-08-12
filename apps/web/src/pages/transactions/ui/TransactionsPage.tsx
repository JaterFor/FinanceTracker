import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useCategoriesQuery } from '../../../entities/category';
import { useSessionStore } from '../../../entities/session';
import { useDeleteTransactionMutation, useTransactionsQuery } from '../../../entities/transaction';
import { ExpenseChart } from '../../../features/expense-chart';
import { PeriodSwitcher, usePeriodFilter } from '../../../features/period-filter';
import { TransactionList } from '../../../features/transaction-list';
import { pushToast } from '../../../shared/lib';

export function TransactionsPage() {
  const { t } = useTranslation();
  const user = useSessionStore((state) => state.user);
  const logout = useSessionStore((state) => state.logout);
  const { data: transactions, isLoading } = useTransactionsQuery();
  const { data: categories } = useCategoriesQuery();
  const { mutate: deleteTransaction } = useDeleteTransactionMutation();
  const period = usePeriodFilter(transactions ?? []);

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

      <PeriodSwitcher
        mode={period.mode}
        setMode={period.setMode}
        anchor={period.anchor}
        setAnchor={period.setAnchor}
        label={period.label}
        goPrev={period.goPrev}
        goNext={period.goNext}
        canGoNext={period.canGoNext}
        isAllTime={period.isAllTime}
      />

      <ExpenseChart transactions={period.filteredTransactions} categories={categories ?? []} />

      {isLoading ? (
        <p>{t('transactions.loading')}</p>
      ) : (
        <TransactionList
          transactions={period.filteredTransactions}
          categories={categories ?? []}
          onDelete={handleDelete}
        />
      )}

      <Link to="/add" className="fab" aria-label={t('addTransaction.add')}>
        +
      </Link>
    </main>
  );
}
