import { create } from 'zustand';

export interface Toast {
  id: number;
  type: 'success' | 'error';
  message: string;
}

interface ToastState {
  toasts: Toast[];
  push: (type: Toast['type'], message: string) => void;
  dismiss: (id: number) => void;
}

let nextId = 1;

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (type, message) => {
    const id = nextId++;
    set((state) => ({ toasts: [...state.toasts, { id, type, message }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) }));
    }, 3500);
  },
  dismiss: (id) => {
    set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) }));
  },
}));

export function pushToast(type: Toast['type'], message: string) {
  useToastStore.getState().push(type, message);
}
