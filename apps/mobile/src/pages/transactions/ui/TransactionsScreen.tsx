import { Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSessionStore } from '../../../entities/session';
import { useTransactionsQuery } from '../../../entities/transaction';
import { AddTransactionForm } from '../../../features/add-transaction';
import { colors } from '../../../shared/ui';

export function TransactionsScreen() {
  const user = useSessionStore((state) => state.user);
  const logout = useSessionStore((state) => state.logout);
  const { data: transactions, isLoading } = useTransactionsQuery();

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Transactions</Text>
        <Text style={styles.muted}>{user?.email}</Text>
        <Button title="Sign out" color={colors.primary} onPress={() => logout()} />
      </View>

      <AddTransactionForm />

      {isLoading ? (
        <Text style={styles.muted}>Loading…</Text>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.rowText}>
                {item.type === 'income' ? '+' : '-'}
                {(item.amount / 100).toFixed(2)} — {item.note ?? 'no note'}
              </Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16, gap: 16, backgroundColor: colors.background },
  header: { gap: 4 },
  title: { fontSize: 24, fontWeight: '600', color: colors.text },
  muted: { color: colors.textMuted },
  row: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.border },
  rowText: { color: colors.text },
});
