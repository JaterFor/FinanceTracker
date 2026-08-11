import type { CreateAccountInput } from '@finance-tracker/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../shared/api';

const accountsKey = ['accounts'] as const;

export function useAccountsQuery() {
  return useQuery({
    queryKey: accountsKey,
    queryFn: () => apiClient.listAccounts(),
  });
}

export function useCreateAccountMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateAccountInput) => apiClient.createAccount(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountsKey });
    },
  });
}
