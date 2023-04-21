import { createStore, useStore } from 'zustand';
import { LAST_SYNC_KEY, memoStore } from '../memo/memo-store';
import { User } from './user';

const USER_KEY = 'user';
const TOKEN_KEY = 'token';
const SYNC_INTERVAL = 1000 * 60 * 2; // 2 minutes

// TODO merge with memo-store
interface ConnectStore {
  user: User | null;
  token: string | null;
  syncInterval: number | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  renewToken: (newToken: string) => void;
  manualSync: () => void;
}

function createSyncInterval() {
  memoStore.getState().syncMemos();
  return window.setInterval(
    () => memoStore.getState().syncMemos(),
    SYNC_INTERVAL,
  );
}

export const connectStore = createStore<ConnectStore>((set, get) => {
  const user = localStorage.getItem(USER_KEY)
    ? JSON.parse(localStorage.getItem(USER_KEY)!)
    : null;
  const token = localStorage.getItem(TOKEN_KEY);
  return {
    user,
    token,
    syncInterval: user && token ? createSyncInterval() : null,
    login: (user: User, token: string) => {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      localStorage.setItem(TOKEN_KEY, token);
      set({ user, token, syncInterval: createSyncInterval() });
    },
    logout: () => {
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(LAST_SYNC_KEY);
      const { syncInterval } = get();
      if (syncInterval) {
        clearInterval(syncInterval);
      }
      set({ user: null, token: null, syncInterval: null });
    },
    renewToken: (token: string) => {
      localStorage.setItem(TOKEN_KEY, token);
      set({ token });
    },
    manualSync: () => {
      const { syncInterval, user, token } = get();
      if (syncInterval) {
        clearInterval(syncInterval);
      }
      if (user && token) {
        set({ syncInterval: createSyncInterval() });
      }
    },
  };
});

export function useConnectStore() {
  return useStore(connectStore);
}
