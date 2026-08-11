import type { CreateTransactionInput } from '@finance-tracker/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../shared/api';

const transactionsKey = ['transactions'] as const;

export function useTransactionsQuery() {
  return useQuery({
    queryKey: transactionsKey,
    queryFn: () => apiClient.listTransactions(),
  });
}

export function useCreateTransactionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTransactionInput) => apiClient.createTransaction(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionsKey });
    },
  });
}

export function useDeleteTransactionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionsKey });
    },
  });
}
