import type { User } from '@finance-tracker/shared';
import { create } from 'zustand';
import { clearStoredSession, readStoredSession, writeStoredSession } from '../../../shared/config';

interface SessionState {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const initial = readStoredSession();

export const useSessionStore = create<SessionState>((set) => ({
  user: initial?.user ?? null,
  isAuthenticated: initial !== null,
  login: (token, user) => {
    writeStoredSession({ token, user });
    set({ user, isAuthenticated: true });
  },
  logout: () => {
    clearStoredSession();
    set({ user: null, isAuthenticated: false });
  },
}));
