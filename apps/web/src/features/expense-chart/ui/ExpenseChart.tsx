import type { Category, Transaction } from '@finance-tracker/shared';
import { useTranslation } from 'react-i18next';
import { formatAmount } from '../../../shared/lib';
import { type ChartPeriod, useExpenseBreakdown } from '../model/use-expense-breakdown';

const RADIUS = 40;
const STROKE = 16;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const PERIODS: ChartPeriod[] = ['week', 'month', 'allTime'];

export function ExpenseChart({
  transactions,
  categories,
}: {
  transactions: Transaction[];
  categories: Category[];
}) {
  const { t } = useTranslation();
  const { period, setPeriod, slices, total } = useExpenseBreakdown(transactions, categories);

  let offset = 0;

  return (
    <div className="expense-chart">
      <div className="chart-period-switch">
        {PERIODS.map((option) => (
          <button
            key={option}
            type="button"
            className={option === period ? 'chart-period active' : 'chart-period'}
            onClick={() => setPeriod(option)}
          >
            {t(`expenseChart.${option}`)}
          </button>
        ))}
      </div>

      {slices.length === 0 ? (
        <p className="chart-empty">{t('expenseChart.noExpenses')}</p>
      ) : (
        <div className="chart-body">
          <svg
            viewBox="0 0 100 100"
            className="chart-donut"
            role="img"
            aria-label={t('expenseChart.total')}
          >
            <title>{t('expenseChart.total')}</title>
            <circle
              cx="50"
              cy="50"
              r={RADIUS}
              fill="none"
              stroke="var(--color-border)"
              strokeWidth={STROKE}
            />
            {slices.map((slice) => {
              const dash = slice.percent * CIRCUMFERENCE;
              const circle = (
                <circle
                  key={slice.categoryId}
                  cx="50"
                  cy="50"
                  r={RADIUS}
                  fill="none"
                  stroke={slice.color}
                  strokeWidth={STROKE}
                  strokeDasharray={`${dash} ${CIRCUMFERENCE - dash}`}
                  strokeDashoffset={-offset}
                  transform="rotate(-90 50 50)"
                />
              );
              offset += dash;
              return circle;
            })}
            <text x="50" y="47" textAnchor="middle" className="chart-total-amount">
              {Math.round(total / 100)} ₽
            </text>
            <text x="50" y="60" textAnchor="middle" className="chart-total-label">
              {t('expenseChart.total')}
            </text>
          </svg>

          <ul className="chart-legend">
            {slices.map((slice) => (
              <li key={slice.categoryId}>
                <span className="chart-legend-dot" style={{ backgroundColor: slice.color }}>
                  {slice.icon}
                </span>
                <span className="chart-legend-name">{slice.name}</span>
                <span className="chart-legend-amount">{formatAmount(slice.amount)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
