import type { User } from '@finance-tracker/shared';
import * as SecureStore from 'expo-secure-store';

const STORAGE_KEY = 'finance-tracker-session';

export interface StoredSession {
  token: string;
  user: User;
}

export async function readStoredSession(): Promise<StoredSession | null> {
  const raw = await SecureStore.getItemAsync(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredSession;
  } catch {
    return null;
  }
}

export async function writeStoredSession(session: StoredSession): Promise<void> {
  await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(session));
}

export async function clearStoredSession(): Promise<void> {
  await SecureStore.deleteItemAsync(STORAGE_KEY);
}

export async function getStoredToken(): Promise<string | null> {
  const session = await readStoredSession();
  return session?.token ?? null;
}
