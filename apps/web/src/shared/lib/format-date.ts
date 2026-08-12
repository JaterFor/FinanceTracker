function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

const dayMonthFormatter = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' });
const dayFormatter = new Intl.DateTimeFormat('ru-RU', { day: 'numeric' });
const monthYearFormatter = new Intl.DateTimeFormat('ru-RU', { month: 'long', year: 'numeric' });

export function formatDayLabel(date: Date): string {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (isSameDay(date, today)) return 'Сегодня';
  if (isSameDay(date, yesterday)) return 'Вчера';
  return dayMonthFormatter.format(date);
}

export function formatWeekLabel(start: Date, end: Date): string {
  const sameMonth =
    start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
  if (sameMonth) {
    return `${dayFormatter.format(start)}–${dayMonthFormatter.format(end)}`;
  }
  return `${dayMonthFormatter.format(start)} – ${dayMonthFormatter.format(end)}`;
}

export function formatMonthLabel(date: Date): string {
  const label = monthYearFormatter.format(date);
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function toDateInputValue(date: Date): string {
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 10);
}
