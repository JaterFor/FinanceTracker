import type { Transaction } from '@finance-tracker/shared';

export interface TransactionDayGroup {
  dateKey: string;
  date: Date;
  total: number;
  transactions: Transaction[];
}

export function groupTransactionsByDay(transactions: Transaction[]): TransactionDayGroup[] {
  const groups = new Map<string, TransactionDayGroup>();

  for (const transaction of transactions) {
    const date = new Date(transaction.occurredAt);
    const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

    let group = groups.get(dateKey);
    if (!group) {
      group = { dateKey, date, total: 0, transactions: [] };
      groups.set(dateKey, group);
    }
    group.transactions.push(transaction);
    group.total += transaction.type === 'income' ? transaction.amount : -transaction.amount;
  }

  return [...groups.values()];
}
