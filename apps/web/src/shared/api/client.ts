import { createApiClient } from '@finance-tracker/shared';
import { getStoredToken } from '../config';

export const apiClient = createApiClient({
  baseUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  getToken: getStoredToken,
});
