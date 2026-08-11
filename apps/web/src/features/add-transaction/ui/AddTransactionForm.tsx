import type { TransactionType } from '@finance-tracker/shared';
import { type FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCategoriesQuery } from '../../../entities/category';
import { useCreateTransactionMutation } from '../../../entities/transaction';

export function AddTransactionForm() {
  const { t } = useTranslation();
  const { data: categories } = useCategoriesQuery();
  const { mutate, isPending } = useCreateTransactionMutation();

  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [categoryId, setCategoryId] = useState('');
  const [note, setNote] = useState('');

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!categoryId) return;

    mutate(
      {
        amount: Math.round(Number(amount) * 100),
        type,
        categoryId,
        note: note || undefined,
        occurredAt: new Date().toISOString(),
      },
      {
        onSuccess: () => {
          setAmount('');
          setNote('');
        },
      },
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        {t('addTransaction.amount')}
        <input
          type="number"
          step="0.01"
          min="0"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          required
        />
      </label>
      <label>
        {t('addTransaction.type')}
        <select value={type} onChange={(event) => setType(event.target.value as TransactionType)}>
          <option value="expense">{t('addTransaction.expense')}</option>
          <option value="income">{t('addTransaction.income')}</option>
        </select>
      </label>
      <span>{t('addTransaction.category')}</span>
      <div className="category-grid">
        {categories?.map((category) => (
          <button
            key={category.id}
            type="button"
            className={category.id === categoryId ? 'category-badge selected' : 'category-badge'}
            onClick={() => setCategoryId(category.id)}
          >
            <span className="category-icon" style={{ backgroundColor: category.color }}>
              {category.icon}
            </span>
            {category.name}
          </button>
        ))}
      </div>
      <label>
        {t('addTransaction.note')}
        <input type="text" value={note} onChange={(event) => setNote(event.target.value)} />
      </label>
      <button type="submit" disabled={isPending}>
        {isPending ? t('addTransaction.adding') : t('addTransaction.add')}
      </button>
    </form>
  );
}
