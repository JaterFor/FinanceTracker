const formatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 2,
});

export function formatAmount(cents: number): string {
  return formatter.format(cents / 100);
}
