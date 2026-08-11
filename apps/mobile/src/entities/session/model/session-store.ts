import type { User } from '@finance-tracker/shared';
import { create } from 'zustand';
import { clearStoredSession, readStoredSession, writeStoredSession } from '../../../shared/config';

interface SessionState {
  user: User | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  hydrate: () => Promise<void>;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
}

export const useSessionStore = create<SessionState>((set) => ({
  user: null,
  isAuthenticated: false,
  isHydrated: false,
  hydrate: async () => {
    const stored = await readStoredSession();
    set({ user: stored?.user ?? null, isAuthenticated: stored !== null, isHydrated: true });
  },
  login: async (token, user) => {
    await writeStoredSession({ token, user });
    set({ user, isAuthenticated: true });
  },
  logout: async () => {
    await clearStoredSession();
    set({ user: null, isAuthenticated: false });
  },
}));
