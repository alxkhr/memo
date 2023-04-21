import { SyncedMemo } from '../../../server/src/memo/memo';
import { requestNewToken } from '../connect/connect-api';
import { connectStore } from '../connect/connect-store';
import { newError } from '../error/error';
import { StoredMemo } from './memo';

export async function syncMemos(
  storedMemos: StoredMemo[],
  lastSync: string | null,
  token: string,
  tries = 0,
): Promise<SyncedMemo[]> {
  const bodyJson = {
    newMemos: storedMemos.filter(
      (memo) => !lastSync || memo.updatedAt > lastSync,
    ) as SyncedMemo[],
    lastSync,
  };
  const result = await fetch('/api/memo/sync', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(bodyJson),
  });
  // TODO outsource a connected api layer
  if (result.status === 401) {
    const newToken = await requestNewToken();
    if (tries > 3) {
      throw newError('ApplicationError', 'Could not refresh token');
    }
    return syncMemos(storedMemos, lastSync, newToken, tries + 1);
  }
  const { newMemos, newToken } = await result.json();
  if (newToken) {
    connectStore.getState().renewToken(newToken);
  }
  return newMemos;
}
