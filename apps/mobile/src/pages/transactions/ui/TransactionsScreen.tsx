import { Button, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useSessionStore } from '../../../entities/session';
import { useTransactionsQuery } from '../../../entities/transaction';
import { AddTransactionForm } from '../../../features/add-transaction';

export function TransactionsScreen() {
  const user = useSessionStore((state) => state.user);
  const logout = useSessionStore((state) => state.logout);
  const { data: transactions, isLoading } = useTransactionsQuery();

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Transactions</Text>
        <Text>{user?.email}</Text>
        <Button title="Sign out" onPress={() => logout()} />
      </View>

      <AddTransactionForm />

      {isLoading ? (
        <Text>Loading…</Text>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text>
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
  screen: { flex: 1, padding: 16, gap: 16 },
  header: { gap: 4 },
  title: { fontSize: 24, fontWeight: '600' },
  row: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee' },
});
