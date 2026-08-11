import type { TransactionType } from '@finance-tracker/shared';
import { useState } from 'react';
import { Button, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useCategoriesQuery } from '../../../entities/category';
import { useCreateTransactionMutation } from '../../../entities/transaction';
import { colors } from '../../../shared/ui';

export function AddTransactionForm() {
  const { data: categories } = useCategoriesQuery();
  const { mutate, isPending } = useCreateTransactionMutation();

  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [categoryId, setCategoryId] = useState('');
  const [note, setNote] = useState('');

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
        placeholder="Amount"
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
            <Text style={type === option ? styles.chipTextActive : styles.chipText}>{option}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.row}>
        {categories?.map((category) => (
          <Pressable
            key={category.id}
            onPress={() => setCategoryId(category.id)}
            style={[styles.chip, categoryId === category.id && styles.chipActive]}
          >
            <Text style={categoryId === category.id ? styles.chipTextActive : styles.chipText}>
              {category.name}
            </Text>
          </Pressable>
        ))}
      </View>

      <TextInput
        placeholder="Note"
        placeholderTextColor={colors.textMuted}
        value={note}
        onChangeText={setNote}
        style={styles.input}
      />

      <Button
        title={isPending ? 'Adding…' : 'Add transaction'}
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
});
