import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../shared/api';

export function useCategoriesQuery() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => apiClient.listCategories(),
  });
}
