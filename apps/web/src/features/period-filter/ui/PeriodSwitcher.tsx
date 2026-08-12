import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toDateInputValue } from '../../../shared/lib';
import type { PeriodMode } from '../model/use-period-filter';

const MODES: PeriodMode[] = ['day', 'week', 'month', 'allTime'];

export function PeriodSwitcher({
  mode,
  setMode,
  anchor,
  setAnchor,
  label,
  goPrev,
  goNext,
  canGoNext,
  isAllTime,
}: {
  mode: PeriodMode;
  setMode: (mode: PeriodMode) => void;
  anchor: Date;
  setAnchor: (date: Date) => void;
  label: string;
  goPrev: () => void;
  goNext: () => void;
  canGoNext: boolean;
  isAllTime: boolean;
}) {
  const { t } = useTranslation();

  return (
    <div className="period-switcher">
      <div className="chart-period-switch">
        {MODES.map((option) => (
          <button
            key={option}
            type="button"
            className={option === mode ? 'chart-period active' : 'chart-period'}
            onClick={() => setMode(option)}
          >
            {t(`period.${option}`)}
          </button>
        ))}
      </div>

      {!isAllTime && (
        <div className="period-nav">
          <button type="button" className="period-arrow" onClick={goPrev} aria-label="Назад">
            <ChevronLeft />
          </button>
          <span className="period-label">{label}</span>
          <input
            type="date"
            className="period-date-input"
            value={toDateInputValue(anchor)}
            max={toDateInputValue(new Date())}
            onChange={(event) => {
              if (event.target.value) setAnchor(new Date(`${event.target.value}T12:00:00`));
            }}
            aria-label="Выбрать дату"
          />
          <button
            type="button"
            className="period-arrow"
            onClick={goNext}
            disabled={!canGoNext}
            aria-label="Вперёд"
          >
            <ChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}
