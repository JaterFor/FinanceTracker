import { useTranslation } from 'react-i18next';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCategoriesQuery } from '../../../entities/category';
import { useSessionStore } from '../../../entities/session';
import { useTransactionsQuery } from '../../../entities/transaction';
import { AddTransactionForm } from '../../../features/add-transaction';
import { colors } from '../../../shared/ui';

export function TransactionsScreen() {
  const { t } = useTranslation();
  const user = useSessionStore((state) => state.user);
  const logout = useSessionStore((state) => state.logout);
  const { data: transactions, isLoading } = useTransactionsQuery();
  const { data: categories } = useCategoriesQuery();
  const categoryById = new Map(categories?.map((category) => [category.id, category]));

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('transactions.title')}</Text>
        <Text style={styles.muted}>{user?.email}</Text>
        <Button title={t('transactions.signOut')} color={colors.primary} onPress={() => logout()} />
      </View>

      <AddTransactionForm />

      {isLoading ? (
        <Text style={styles.muted}>{t('transactions.loading')}</Text>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const category = categoryById.get(item.categoryId);
            return (
              <View style={styles.row}>
                {category ? (
                  <View style={[styles.rowIcon, { backgroundColor: category.color }]}>
                    <Text style={styles.rowIconText}>{category.icon}</Text>
                  </View>
                ) : null}
                <Text style={styles.rowText}>
                  {item.type === 'income' ? '+' : '-'}
                  {(item.amount / 100).toFixed(2)} — {item.note ?? t('transactions.noNote')}
                </Text>
              </View>
            );
          }}
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  rowIconText: { fontSize: 13 },
  rowText: { color: colors.text },
});
