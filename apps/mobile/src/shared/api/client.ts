import { createApiClient } from '@finance-tracker/shared';
import { getStoredToken } from '../config';

export const apiClient = createApiClient({
  baseUrl: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000',
  getToken: getStoredToken,
});
