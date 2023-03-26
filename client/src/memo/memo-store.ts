import { create } from "zustand";
import { Memo } from "./memo";

interface MemoStore {
  memos: Memo[];
  addMemo: (memo: Memo) => void;
  deleteMemo: (id: string) => void;
  updateMemo: (memo: Memo) => void;
}

export const useMemoStore = create<MemoStore>((set) => ({
  memos: [],
  addMemo: (memo: Memo) => {
    set((state) => ({ memos: [...state.memos, memo] }));
  },
  deleteMemo: (id: string) => {
    set((state) => ({
      memos: state.memos.filter((memo) => memo.id !== id),
    }));
  },
  updateMemo: (memo: Memo) => {
    set((state) => ({
      memos: state.memos.map((m) => (m.id === memo.id ? memo : m)),
    }));
  },
}));
