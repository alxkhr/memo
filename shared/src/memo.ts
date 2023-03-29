export interface Memo {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoredMemo extends Memo {
  deleted: boolean;
}

export interface StoredServerMemo {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  deleted: boolean;
}
