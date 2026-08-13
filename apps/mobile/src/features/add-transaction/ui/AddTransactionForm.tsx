import type { TransactionType } from '@finance-tracker/shared';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useCategoriesQuery } from '../../../entities/category';
import { useCreateTransactionMutation } from '../../../entities/transaction';
import { CategoryIcon, colors } from '../../../shared/ui';

const typeLabels: Record<TransactionType, 'addTransaction.expense' | 'addTransaction.income'> = {
  expense: 'addTransaction.expense',
  income: 'addTransaction.income',
};

export function AddTransactionForm() {
  const { t } = useTranslation();
  const { data: categories } = useCategoriesQuery();
  const { mutate, isPending } = useCreateTransactionMutation();

  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [categoryId, setCategoryId] = useState('');
  const [note, setNote] = useState('');

  const categoriesForType = categories?.filter((category) => category.type === type);

  function handleTypeChange(nextType: TransactionType) {
    setType(nextType);
    setCategoryId('');
  }

  function handleSubmit() {
    if (!categoryId || !amount) return;

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
            onPress={() => handleTypeChange(option)}
            style={[styles.chip, type === option && styles.chipActive]}
          >
            <Text style={type === option ? styles.chipTextActive : styles.chipText}>
              {t(typeLabels[option])}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.categoryGrid}>
        {categoriesForType?.map((category) => {
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
                <CategoryIcon name={category.icon} size={20} />
              </View>
              <Text style={selected ? styles.categoryNameSelected : styles.categoryName}>
                {category.name}
              </Text>
            </Pressable>
          );
        })}
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
        disabled={isPending || !categoryId || !amount}
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
  categoryName: { fontSize: 12, color: colors.textMuted, textAlign: 'center' },
  categoryNameSelected: { fontSize: 12, color: colors.text, textAlign: 'center' },
});
