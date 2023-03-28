import { useStore } from 'zustand';
import { createStore } from 'zustand/vanilla';
import { Memo } from './memo';
import { deleteMemo, storeMemo, getMemos } from './memo-db';

interface MemoStore {
  memos: Memo[];
  addMemo: (memo: Memo) => void;
  deleteMemo: (id: string) => void;
  updateMemo: (memo: Memo) => void;
}

const memoStore = createStore<MemoStore>((set) => ({
  memos: [],
  setMemos: (memos: Memo[]) => set({ memos }),
  addMemo: (memo: Memo) => {
    storeMemo(memo);
    set((state) => ({ memos: [...state.memos, memo] }));
  },
  deleteMemo: (id: string) => {
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
}));

(async function () {
  const memos = await getMemos();
  memoStore.setState({ memos });
})();

export function useMemoStore() {
  return useStore(memoStore);
}
