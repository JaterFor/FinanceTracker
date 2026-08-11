import type { TransactionType } from '@finance-tracker/shared';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAccountsQuery, useCreateAccountMutation } from '../../../entities/account';
import { useCategoriesQuery } from '../../../entities/category';
import { useCreateTransactionMutation } from '../../../entities/transaction';
import { colors } from '../../../shared/ui';

const typeLabels: Record<TransactionType, 'addTransaction.expense' | 'addTransaction.income'> = {
  expense: 'addTransaction.expense',
  income: 'addTransaction.income',
};

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

  function handleSubmit() {
    if (!categoryId || !accountId || !amount) return;

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
        },
      },
    );
  }

  return (
    <View style={styles.form}>
      <TextInput
        placeholder={t('addTransaction.amount')}
        placeholderTextColor={colors.textMuted}
        keyboardType="decimal-pad"
        value={amount}
        onChangeText={setAmount}
        style={styles.input}
      />

      <View style={styles.row}>
        {(['expense', 'income'] as const).map((option) => (
          <Pressable
            key={option}
            onPress={() => setType(option)}
            style={[styles.chip, type === option && styles.chipActive]}
          >
            <Text style={type === option ? styles.chipTextActive : styles.chipText}>
              {t(typeLabels[option])}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.categoryGrid}>
        {categories?.map((category) => {
          const selected = categoryId === category.id;
          return (
            <Pressable
              key={category.id}
              onPress={() => setCategoryId(category.id)}
              style={styles.categoryBadge}
            >
              <View
                style={[
                  styles.categoryIcon,
                  { backgroundColor: category.color },
                  selected && styles.categoryIconSelected,
                ]}
              >
                <Text style={styles.categoryIconText}>{category.icon}</Text>
              </View>
              <Text style={selected ? styles.categoryNameSelected : styles.categoryName}>
                {category.name}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.row}>
        {accounts?.map((account) => {
          const selected = accountId === account.id;
          return (
            <Pressable
              key={account.id}
              onPress={() => setAccountId(account.id)}
              style={[styles.chip, selected && styles.chipActive]}
            >
              <Text style={selected ? styles.chipTextActive : styles.chipText}>{account.name}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.inlineForm}>
        <TextInput
          placeholder={t('addTransaction.newAccountPlaceholder')}
          placeholderTextColor={colors.textMuted}
          value={newAccountName}
          onChangeText={setNewAccountName}
          style={[styles.input, styles.inlineInput]}
        />
        <Button
          title={t('addTransaction.addAccount')}
          color={colors.primary}
          disabled={isCreatingAccount}
          onPress={handleAddAccount}
        />
      </View>

      <TextInput
        placeholder={t('addTransaction.note')}
        placeholderTextColor={colors.textMuted}
        value={note}
        onChangeText={setNote}
        style={styles.input}
      />

      <Button
        title={isPending ? t('addTransaction.adding') : t('addTransaction.add')}
        color={colors.primary}
        disabled={isPending || !categoryId || !accountId || !amount}
        onPress={handleSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: 12 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.text },
  chipTextActive: { color: colors.primaryText },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  categoryBadge: { alignItems: 'center', width: 64, gap: 4 },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.55,
  },
  categoryIconSelected: { opacity: 1, borderWidth: 2, borderColor: colors.text },
  categoryIconText: { fontSize: 20 },
  categoryName: { fontSize: 12, color: colors.textMuted, textAlign: 'center' },
  categoryNameSelected: { fontSize: 12, color: colors.text, textAlign: 'center' },
  inlineForm: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  inlineInput: { flex: 1 },
});
