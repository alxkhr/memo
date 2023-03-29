import { useStore } from 'zustand';
import { createStore } from 'zustand/vanilla';
import { Memo, StoredMemo } from '../../../shared/src/memo';
import { deleteMemo, storeMemo, getMemos, syncMemos } from './memo-db';

const LAST_SYNC_KEY = 'lastSync';
const SYNC_INTERVAL = 1000; // 1000 * 60 * 2; // 2 minutes

interface MemoStore {
  memos: Memo[];
  addMemo: (memo: Memo) => void;
  removeMemo: (id: string) => void;
  updateMemo: (memo: Memo) => void;
  syncMemos: () => Promise<void>;
}

const memoStore = createStore<MemoStore>((set, get) => ({
  memos: [],
  setMemos: (memos: Memo[]) => set({ memos }),
  addMemo: (memo: Memo) => {
    storeMemo(memo);
    set((state) => ({ memos: [...state.memos, memo] }));
  },
  removeMemo: (id: string) => {
    deleteMemo(id);
    set((state) => ({
      memos: state.memos.filter((memo) => memo.id !== id),
    }));
  },
  updateMemo: (memo: Memo) => {
    storeMemo(memo);
    set((state) => ({
      memos: state.memos.map((m) => (m.id === memo.id ? memo : m)),
    }));
  },
  syncMemos: async () => {
    const time = new Date().toISOString();
    // get memos from indexedDB because of deleted memos
    const storedMemos = await getMemos();
    const lastSync = localStorage.getItem(LAST_SYNC_KEY);
    const bodyJson = {
      newMemos: storedMemos.filter(
        (memo) => !lastSync || memo.updatedAt > lastSync,
      ),
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
      }).then((r) => r.json() as Promise<{ newMemos: StoredMemo[] }>);
      await syncMemos(resultBodyJson.newMemos);
      const newMemoState = await getMemos();
      // TODO what happens if deleted memo is opened?
      set(() => ({ memos: newMemoState }));
      localStorage.setItem(LAST_SYNC_KEY, time);
    } catch (e) {
      console.error(e);
    }
  },
}));

(async function () {
  const memos = await getMemos();
  memoStore.setState({ memos });
  setInterval(() => memoStore.getState().syncMemos(), SYNC_INTERVAL);
})();

export function useMemoStore() {
  return useStore(memoStore);
}
