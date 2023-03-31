import { create } from 'zustand';
import { memoStore } from '../memo/memo-store';
import { User } from './user';

const USER_KEY = 'user';
const TOKEN_KEY = 'token';
const SYNC_INTERVAL = 1000; // 1000 * 60 * 2; // 2 minutes

interface ConnectStore {
  user: User | null;
  syncInterval: number | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

function createSyncInterval() {
  return window.setInterval(
    () => memoStore.getState().syncMemos(),
    SYNC_INTERVAL,
  );
}

export const useConnectStore = create<ConnectStore>((set, get) => {
  const user = localStorage.getItem(USER_KEY)
    ? JSON.parse(localStorage.getItem(USER_KEY)!)
    : null;
  return {
    user,
    syncInterval: user ? createSyncInterval() : null,
    login: (user: User, token: string) => {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      localStorage.setItem(TOKEN_KEY, token);
      set({ user, syncInterval: createSyncInterval() });
    },
    logout: () => {
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(TOKEN_KEY);
      const { syncInterval } = get();
      if (syncInterval) {
        clearInterval(syncInterval);
      }
      set({ user: null, syncInterval: null });
    },
  };
});
