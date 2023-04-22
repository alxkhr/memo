import { useStore } from 'zustand';
import { createStore } from 'zustand/vanilla';
import { Memo } from './memo';
import { SyncedMemo } from '../../../server/src/memo/memo';
import {
  deleteMemo,
  storeMemo,
  getMemos,
  getRawMemos,
  storeSyncedMemos,
  undoDeleteAndGetMemo,
} from './memo-db';
import { syncMemos } from './memo-api';
import { connectStore } from '../connect/connect-store';
import { AppError, newError } from '../error/error';
import { toastStore } from '../toast/toast-store';
import { router } from '../router';

export const LAST_SYNC_KEY = 'lastSync';

interface MemoStore {
  memos: Memo[] | null;
  addMemo: (memo: Memo) => void;
  removeMemo: (id: string) => void;
  undoRemoveMemo: (id: string) => Promise<void>;
  updateMemo: (memo: Memo) => void;
  syncMemos: () => Promise<void>;
}

export const memoStore = createStore<MemoStore>((set, get) => {
  getMemos().then((memos) => set({ memos }));
  function setIfInitialized(...args: Parameters<typeof set>) {
    if (!get().memos) {
      throw newError('ApplicationError', 'Memos are not initialized');
    }
    return set(...args);
  }
  return {
    memos: null,
    setMemos: (memos: Memo[]) => set({ memos }),
    addMemo: (memo: Memo) => {
      storeMemo(memo);
      setIfInitialized((state) => ({ memos: [...state.memos!, memo] }));
    },
    removeMemo: (id: string) => {
      deleteMemo(id);
      setIfInitialized((state) => ({
        memos: state.memos!.filter((memo) => memo.id !== id),
      }));
    },
    undoRemoveMemo: async (id: string) => {
      const memo = await undoDeleteAndGetMemo(id);
      setIfInitialized((state) => ({
        memos: [...state.memos!, memo],
      }));
    },
    updateMemo: (memo: Memo) => {
      storeMemo(memo);
      setIfInitialized((state) => ({
        memos: state.memos!.map((m) => (m.id === memo.id ? memo : m)),
      }));
    },
    syncMemos: async () => {
      const time = new Date().toISOString();
      // get memos from indexedDB because of deleted memos
      const storedMemos = await getRawMemos();
      const lastSync = localStorage.getItem(LAST_SYNC_KEY);
      // TODO throw if no token
      const { token, logout } = connectStore.getState();
      let newMemos: SyncedMemo[] | undefined;
      try {
        newMemos = await syncMemos(storedMemos, lastSync, token!);
      } catch (e) {
        switch ((e as AppError).type) {
          case 'LoginExpiredError':
            toastStore.getState().addToast({
              children: 'Login expired. Please log in again.',
              onClick: () => router.navigate('/login'),
            });
            logout();
            break;
          default:
            // TODO handle error
            console.error(e);
        }
        return;
      }
      await storeSyncedMemos(newMemos!);
      const newMemoState = await getMemos();
      // TODO what happens if deleted memo is opened?
      set(() => ({ memos: newMemoState }));
      localStorage.setItem(LAST_SYNC_KEY, time);
    },
  };
});

export function useMemoStore() {
  return useStore(memoStore);
}
