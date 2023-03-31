import { SyncedMemo } from '../../../server/src/memo/memo';
import { StoredMemo } from './memo';

export async function syncMemos(
  storedMemos: StoredMemo[],
  lastSync: string | null,
): Promise<{ newMemos: SyncedMemo[] }> {
  const bodyJson = {
    newMemos: storedMemos.filter(
      (memo) => !lastSync || memo.updatedAt > lastSync,
    ) as SyncedMemo[],
    lastSync,
  };
  // TODO maybe receive new token from server
  const result = await fetch('/api/memo/sync', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(bodyJson),
  });
  return result.json();
}
