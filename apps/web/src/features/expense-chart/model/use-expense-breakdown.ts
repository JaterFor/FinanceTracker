import type { Category, Transaction } from '@finance-tracker/shared';
import { useMemo } from 'react';

export interface BreakdownSlice {
  categoryId: string;
  name: string;
  color: string;
  icon: string;
  amount: number;
  percent: number;
}

export function useExpenseBreakdown(transactions: Transaction[] = [], categories: Category[] = []) {
  return useMemo(() => {
    const amountByCategory = new Map<string, number>();
    for (const transaction of transactions) {
      if (transaction.type !== 'expense') continue;
      amountByCategory.set(
        transaction.categoryId,
        (amountByCategory.get(transaction.categoryId) ?? 0) + transaction.amount,
      );
    }

    const sum = [...amountByCategory.values()].reduce((acc, value) => acc + value, 0);
    const categoryById = new Map(categories.map((category) => [category.id, category]));

    const slices: BreakdownSlice[] = [...amountByCategory.entries()]
      .map(([categoryId, amount]) => {
        const category = categoryById.get(categoryId);
        return {
          categoryId,
          name: category?.name ?? categoryId,
          color: category?.color ?? '#888888',
          icon: category?.icon ?? 'help-circle',
          amount,
          percent: sum === 0 ? 0 : amount / sum,
        };
      })
      .sort((a, b) => b.amount - a.amount);

    return { slices, total: sum };
  }, [transactions, categories]);
}
