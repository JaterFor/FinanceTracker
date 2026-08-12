import type { TransactionType } from '@finance-tracker/shared';
import { Plus } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useAccountsQuery, useCreateAccountMutation } from '../../../entities/account';
import { useCategoriesQuery } from '../../../entities/category';
import { useCreateTransactionMutation } from '../../../entities/transaction';
import { pushToast, toDateInputValue } from '../../../shared/lib';
import { CategoryIcon } from '../../../shared/ui';

export function AddTransactionForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: categories } = useCategoriesQuery();
  const { data: accounts } = useAccountsQuery();
  const { mutate: createAccount, isPending: isCreatingAccount } = useCreateAccountMutation();
  const { mutate, isPending } = useCreateTransactionMutation();

  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [categoryId, setCategoryId] = useState('');
  const [accountId, setAccountId] = useState('');
  const [newAccountName, setNewAccountName] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(() => toDateInputValue(new Date()));

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!categoryId || !accountId) return;

    mutate(
      {
        amount: Math.round(Number(amount) * 100),
        type,
        categoryId,
        accountId,
        note: note || undefined,
        occurredAt: new Date(`${date}T12:00:00`).toISOString(),
      },
      {
        onSuccess: () => {
          pushToast('success', t('addTransaction.added'));
          navigate('/');
        },
        onError: () => {
          pushToast('error', t('addTransaction.addFailed'));
        },
      },
    );
  }

  function handleAddAccount() {
    if (!newAccountName.trim()) return;
    createAccount(
      { name: newAccountName.trim() },
      {
        onSuccess: (account) => {
          setNewAccountName('');
          setAccountId(account.id);
          pushToast('success', t('addTransaction.accountAdded'));
        },
        onError: () => {
          pushToast('error', t('addTransaction.accountAddFailed'));
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
      <div className="field-group">
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
                <CategoryIcon name={category.icon} />
              </span>
              {category.name}
            </button>
          ))}
          <Link to="/categories/new" className="category-badge">
            <span className="category-icon category-icon-add">
              <Plus />
            </span>
            {t('addTransaction.addCategory')}
          </Link>
        </div>
      </div>
      <div className="field-group">
        <label>
          {t('addTransaction.account')}
          <select value={accountId} onChange={(event) => setAccountId(event.target.value)} required>
            <option value="" disabled>
              {t('addTransaction.selectAccount')}
            </option>
            {accounts?.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>
        </label>
        <div className="inline-form">
          <input
            type="text"
            placeholder={t('addTransaction.newAccountPlaceholder')}
            value={newAccountName}
            onChange={(event) => setNewAccountName(event.target.value)}
          />
          <button type="button" disabled={isCreatingAccount} onClick={handleAddAccount}>
            {t('addTransaction.addAccount')}
          </button>
        </div>
      </div>
      <label>
        {t('addTransaction.date')}
        <input
          type="date"
          value={date}
          max={toDateInputValue(new Date())}
          onChange={(event) => setDate(event.target.value)}
          required
        />
      </label>
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
