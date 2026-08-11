import type { User } from '@finance-tracker/shared';

const STORAGE_KEY = 'finance-tracker:session';

export interface StoredSession {
  token: string;
  user: User;
}

export function readStoredSession(): StoredSession | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredSession;
  } catch {
    return null;
  }
}

export function writeStoredSession(session: StoredSession): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearStoredSession(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function getStoredToken(): string | null {
  return readStoredSession()?.token ?? null;
}
