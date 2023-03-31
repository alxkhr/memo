export interface StoredMemo {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  deleted: boolean;
}

export interface SyncedMemo {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
}
