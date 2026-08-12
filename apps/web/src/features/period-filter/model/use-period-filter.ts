import type { Transaction } from '@finance-tracker/shared';
import { useMemo, useState } from 'react';
import { formatDayLabel, formatMonthLabel, formatWeekLabel } from '../../../shared/lib';

export type PeriodMode = 'day' | 'week' | 'month' | 'allTime';

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

function startOfWeek(date: Date): Date {
  const d = startOfDay(date);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  d.setDate(d.getDate() + diff);
  return d;
}

function endOfWeek(date: Date): Date {
  const end = startOfWeek(date);
  end.setDate(end.getDate() + 6);
  return endOfDay(end);
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date): Date {
  return endOfDay(new Date(date.getFullYear(), date.getMonth() + 1, 0));
}

export function usePeriodFilter(transactions: Transaction[] = []) {
  const [mode, setMode] = useState<PeriodMode>('month');
  const [anchor, setAnchor] = useState(() => new Date());

  const { rangeStart, rangeEnd, label } = useMemo(() => {
    switch (mode) {
      case 'day':
        return {
          rangeStart: startOfDay(anchor),
          rangeEnd: endOfDay(anchor),
          label: formatDayLabel(anchor),
        };
      case 'week': {
        const start = startOfWeek(anchor);
        const end = endOfWeek(anchor);
        return { rangeStart: start, rangeEnd: end, label: formatWeekLabel(start, end) };
      }
      case 'month': {
        const start = startOfMonth(anchor);
        const end = endOfMonth(anchor);
        return { rangeStart: start, rangeEnd: end, label: formatMonthLabel(anchor) };
      }
      default:
        return { rangeStart: null, rangeEnd: null, label: '' };
    }
  }, [mode, anchor]);

  const filteredTransactions = useMemo(() => {
    if (!rangeStart || !rangeEnd) return transactions;
    return transactions.filter((transaction) => {
      const occurredAt = new Date(transaction.occurredAt).getTime();
      return occurredAt >= rangeStart.getTime() && occurredAt <= rangeEnd.getTime();
    });
  }, [transactions, rangeStart, rangeEnd]);

  function setModeAndReset(nextMode: PeriodMode) {
    setMode(nextMode);
    setAnchor(new Date());
  }

  function shift(direction: 1 | -1) {
    setAnchor((current) => {
      const next = new Date(current);
      if (mode === 'day') next.setDate(next.getDate() + direction);
      else if (mode === 'week') next.setDate(next.getDate() + 7 * direction);
      else if (mode === 'month') next.setMonth(next.getMonth() + direction);
      return next;
    });
  }

  const canGoNext = rangeEnd !== null && rangeEnd.getTime() < endOfDay(new Date()).getTime();

  return {
    mode,
    setMode: setModeAndReset,
    anchor,
    setAnchor,
    label,
    goPrev: () => shift(-1),
    goNext: () => shift(1),
    canGoNext,
    isAllTime: mode === 'allTime',
    filteredTransactions,
  };
}
