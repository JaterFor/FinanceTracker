import { useSessionStore } from '../../../entities/session';
import { useTransactionsQuery } from '../../../entities/transaction';
import { AddTransactionForm } from '../../../features/add-transaction';

export function TransactionsPage() {
  const user = useSessionStore((state) => state.user);
  const logout = useSessionStore((state) => state.logout);
  const { data: transactions, isLoading } = useTransactionsQuery();

  return (
    <main>
      <header>
        <h1>Transactions</h1>
        <p>
          {user?.email}{' '}
          <button type="button" onClick={logout}>
            Sign out
          </button>
        </p>
      </header>

      <AddTransactionForm />

      {isLoading ? (
        <p>Loading…</p>
      ) : (
        <ul>
          {transactions?.map((transaction) => (
            <li key={transaction.id}>
              {transaction.type === 'income' ? '+' : '-'}
              {(transaction.amount / 100).toFixed(2)} — {transaction.note ?? 'no note'}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
