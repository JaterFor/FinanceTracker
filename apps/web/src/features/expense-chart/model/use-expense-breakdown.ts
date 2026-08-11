import type { Category, Transaction } from '@finance-tracker/shared';
import { useMemo, useState } from 'react';

export type ChartPeriod = 'week' | 'month' | 'allTime';

const PERIOD_DAYS: Record<ChartPeriod, number | null> = {
  week: 7,
  month: 30,
  allTime: null,
};

export interface BreakdownSlice {
  categoryId: string;
  name: string;
  color: string;
  icon: string;
  amount: number;
  percent: number;
}

export function useExpenseBreakdown(transactions: Transaction[] = [], categories: Category[] = []) {
  const [period, setPeriod] = useState<ChartPeriod>('month');

  const { slices, total } = useMemo(() => {
    const days = PERIOD_DAYS[period];
    const since = days === null ? null : Date.now() - days * 24 * 60 * 60 * 1000;

    const amountByCategory = new Map<string, number>();
    for (const transaction of transactions) {
      if (transaction.type !== 'expense') continue;
      if (since !== null && new Date(transaction.occurredAt).getTime() < since) continue;
      amountByCategory.set(
        transaction.categoryId,
        (amountByCategory.get(transaction.categoryId) ?? 0) + transaction.amount,
      );
    }

    const sum = [...amountByCategory.values()].reduce((acc, value) => acc + value, 0);
    const categoryById = new Map(categories.map((category) => [category.id, category]));

    const breakdown: BreakdownSlice[] = [...amountByCategory.entries()]
      .map(([categoryId, amount]) => {
        const category = categoryById.get(categoryId);
        return {
          categoryId,
          name: category?.name ?? categoryId,
          color: category?.color ?? '#888888',
          icon: category?.icon ?? '❔',
          amount,
          percent: sum === 0 ? 0 : amount / sum,
        };
      })
      .sort((a, b) => b.amount - a.amount);

    return { slices: breakdown, total: sum };
  }, [transactions, categories, period]);

  return { period, setPeriod, slices, total };
}
