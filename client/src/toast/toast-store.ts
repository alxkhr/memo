import React from 'react';
import { createStore, useStore } from 'zustand';

export interface Toast {
  children: React.ReactNode;
  onClick?: () => void;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Toast) => void;
  // TODO bad practice, better to use id, because toast reference might change
  removeToast: (toast: Toast) => void;
}

export const toastStore = createStore<ToastStore>((set, get) => ({
  toasts: [],
  addToast: (toast: Toast) => {
    set((state) => ({ toasts: [...state.toasts, toast] }));
    // toast remove themselves after 6 seconds
    setTimeout(() => {
      get().removeToast(toast);
    }, 8000);
  },
  removeToast: (toast: Toast) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t !== toast) })),
}));

export function useToastStore() {
  return useStore(toastStore);
}
