import type { LoginInput } from '@finance-tracker/shared';
import { useMutation } from '@tanstack/react-query';
import { useSessionStore } from '../../../entities/session';
import { apiClient } from '../../../shared/api';

export function useLogin() {
  const login = useSessionStore((state) => state.login);

  return useMutation({
    mutationFn: (input: LoginInput) => apiClient.login(input),
    onSuccess: async (data) => {
      await login(data.token, data.user);
    },
  });
}
