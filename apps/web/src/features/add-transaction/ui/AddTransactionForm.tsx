import type { TransactionType } from '@finance-tracker/shared';
import { type FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccountsQuery, useCreateAccountMutation } from '../../../entities/account';
import { useCategoriesQuery } from '../../../entities/category';
import { useCreateTransactionMutation } from '../../../entities/transaction';
import { pushToast } from '../../../shared/lib';

export function AddTransactionForm() {
  const { t } = useTranslation();
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
        occurredAt: new Date().toISOString(),
      },
      {
        onSuccess: () => {
          setAmount('');
          setNote('');
          pushToast('success', t('addTransaction.added'));
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
