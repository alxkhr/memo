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
} from './memo-db';
import { syncMemos } from './memo-api';

const LAST_SYNC_KEY = 'lastSync';

interface MemoStore {
  memos: Memo[] | null;
  addMemo: (memo: Memo) => void;
  removeMemo: (id: string) => void;
  updateMemo: (memo: Memo) => void;
  syncMemos: () => Promise<void>;
}

export const memoStore = createStore<MemoStore>((set, get) => {
  getMemos().then((memos) => set({ memos }));
  function setIfInitialized(...args: Parameters<typeof set>) {
    if (!get().memos) {
      throw new Error('Memos are not initialized');
    }
    return set(...args);
  }
  return {
    memos: [],
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
      let newMemos: SyncedMemo[] | undefined;
      try {
        newMemos = (await syncMemos(storedMemos, lastSync)).newMemos;
      } catch (e) {
        // TODO handle error
        console.error(e);
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
