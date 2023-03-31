import { useStore } from 'zustand';
import { createStore } from 'zustand/vanilla';
import { Memo } from './memo';
import { SyncedMemo } from '../../../server/src/memo/memo';
import {
  deleteMemo,
  storeMemo,
  getMemos,
  syncMemos,
  getRawMemos,
} from './memo-db';

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
      const bodyJson = {
        newMemos: storedMemos.filter(
          (memo) => !lastSync || memo.updatedAt > lastSync,
        ) as SyncedMemo[],
        lastSync,
      };
      try {
        // TODO maybe receive new token from server
        const resultBodyJson = await fetch('/api/memo/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(bodyJson),
        }).then((r) => r.json() as Promise<{ newMemos: SyncedMemo[] }>);
        await syncMemos(resultBodyJson.newMemos);
        const newMemoState = await getMemos();
        // TODO what happens if deleted memo is opened?
        set(() => ({ memos: newMemoState }));
        localStorage.setItem(LAST_SYNC_KEY, time);
      } catch (e) {
        console.error(e);
      }
    },
  };
});

export function useMemoStore() {
  return useStore(memoStore);
}
