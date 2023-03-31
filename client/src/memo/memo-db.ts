import { SyncedMemo } from '../../../server/src/memo/memo';
import { Memo, StoredMemo } from './memo';

const DB_NAME = 'memo';
const STORE_NAME = 'memo';
const STORE_KEY_PATH = 'id';
const DB_VERSION = 1;

function connect(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = (
        event as IDBVersionChangeEvent & { target: { result: IDBDatabase } }
      ).target.result;
      db.createObjectStore(STORE_NAME, { keyPath: STORE_KEY_PATH });
    };
    request.onsuccess = (event) => {
      const db = (event as Event & { target: { result: IDBDatabase } }).target
        .result;
      resolve(db);
    };
    request.onerror = (e) => reject(e);
  });
}

export async function storeMemo(memo: Memo) {
  const db = await connect();
  const transaction = db.transaction(STORE_NAME, 'readwrite');
  const store = transaction.objectStore(STORE_NAME);
  store.put({ ...memo, deleted: false });
}

export async function storeSyncedMemos(memos: SyncedMemo[]) {
  const db = await connect();
  const transaction = db.transaction(STORE_NAME, 'readwrite');
  const store = transaction.objectStore(STORE_NAME);
  for (const memo of memos) {
    store.put(memo);
  }
}

export async function getRawMemos(): Promise<StoredMemo[]> {
  const db = await connect();
  const transaction = db.transaction(STORE_NAME, 'readonly');
  const store = transaction.objectStore(STORE_NAME);
  const request = store.getAll();
  return new Promise((resolve, reject) => {
    request.onsuccess = (event) => {
      const memos = (event as Event & { target: { result: StoredMemo[] } })
        .target.result;
      resolve(memos);
    };
    request.onerror = (e) => reject(e);
  });
}

export async function getMemos(): Promise<Memo[]> {
  const db = await connect();
  const transaction = db.transaction(STORE_NAME, 'readonly');
  const store = transaction.objectStore(STORE_NAME);
  const request = store.getAll();
  return new Promise((resolve, reject) => {
    request.onsuccess = (event) => {
      const memos = (event as Event & { target: { result: StoredMemo[] } })
        .target.result;
      resolve(memos.filter((memo) => !memo.deleted));
    };
    request.onerror = (e) => reject(e);
  });
}

export async function deleteMemo(id: string) {
  const db = await connect();
  const transaction = db.transaction(STORE_NAME, 'readwrite');
  const store = transaction.objectStore(STORE_NAME);
  const request = store.get(id);
  request.onsuccess = (event) => {
    const memo = (event as Event & { target: { result: StoredMemo } }).target
      .result;
    store.put({ ...memo, deleted: true, updatedAt: new Date().toISOString() });
  };
}
