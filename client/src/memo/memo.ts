export interface Memo {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoredMemo extends Memo {
  deleted: boolean;
}
