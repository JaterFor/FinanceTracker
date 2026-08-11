import type { CreateCategoryInput } from '@finance-tracker/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../shared/api';

const categoriesKey = ['categories'] as const;

export function useCategoriesQuery() {
  return useQuery({
    queryKey: categoriesKey,
    queryFn: () => apiClient.listCategories(),
  });
}

export function useCreateCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateCategoryInput) => apiClient.createCategory(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesKey });
    },
  });
}
