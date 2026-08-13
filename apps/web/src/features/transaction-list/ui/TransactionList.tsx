import type { Category, Transaction } from '@finance-tracker/shared';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { formatAmount, formatDayLabel, glowShadow } from '../../../shared/lib';
import { CategoryIcon } from '../../../shared/ui';
import { groupTransactionsByDay } from '../model/group-transactions';

export function TransactionList({
  transactions,
  categories,
  onDelete,
}: {
  transactions: Transaction[];
  categories: Category[];
  onDelete: (id: string) => void;
}) {
  const { t } = useTranslation();
  const groups = useMemo(() => groupTransactionsByDay(transactions), [transactions]);
  const categoryById = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories]);

  if (transactions.length === 0) {
    return <p className="chart-empty">{t('transactions.empty')}</p>;
  }

  return (
    <div className="transaction-groups">
      {groups.map((group) => (
        <div key={group.dateKey} className="transaction-day-group">
          <div className="transaction-day-header">
            <span>{formatDayLabel(group.date)}</span>
            <span className={group.total >= 0 ? 'amount-income' : 'amount-expense'}>
              {group.total >= 0 ? '+' : '-'}
              {formatAmount(Math.abs(group.total))}
            </span>
          </div>
          <ul>
            {group.transactions.map((transaction) => {
              const category = categoryById.get(transaction.categoryId);
              return (
                <li key={transaction.id} className="transaction-row">
                  {category ? (
                    <span
                      className="transaction-icon"
                      style={{
                        backgroundColor: category.color,
                        boxShadow: glowShadow(category.color),
                      }}
                    >
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
                    onClick={() => onDelete(transaction.id)}
                    aria-label={t('transactions.delete')}
                  >
                    ✕
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
