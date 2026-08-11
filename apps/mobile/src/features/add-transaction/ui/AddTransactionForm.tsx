import type { TransactionType } from '@finance-tracker/shared';
import { useState } from 'react';
import { Button, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useCategoriesQuery } from '../../../entities/category';
import { useCreateTransactionMutation } from '../../../entities/transaction';

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

      <TextInput placeholder="Note" value={note} onChangeText={setNote} style={styles.input} />

      <Button
        title={isPending ? 'Adding…' : 'Add transaction'}
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
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
  },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  chipActive: { backgroundColor: '#222', borderColor: '#222' },
  chipText: { color: '#222' },
  chipTextActive: { color: '#fff' },
});
