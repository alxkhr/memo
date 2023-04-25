import { RequestHandler } from 'express';
import { pgPool } from '../db';
import { StoredMemo, SyncedMemo } from './memo-type';
import crypto from 'crypto';
import { logger } from '../logger';

function isSyncRequest(
  body: unknown,
): body is { lastSync: string | null; newMemos: SyncedMemo[] } {
  return (
    Boolean(body) &&
    typeof body === 'object' &&
    'lastSync' in body! &&
    (body.lastSync === null || typeof body.lastSync === 'string') &&
    'newMemos' in body! &&
    Array.isArray(body.newMemos)
  );
}

export const syncHandler: RequestHandler = async (req, res) => {
  if (!isSyncRequest(req.body)) {
    res.status(400).send('Invalid request');
    return;
  }
  const lastSync = req.body.lastSync || '1970-01-01T00:00:00.000Z';
  const client = await pgPool.connect();
  try {
    const dbResult = await client.query<StoredMemo>(
      'SELECT * FROM memos WHERE user_id = $1 AND updated_at > $2',
      [req.userId, lastSync],
    );
    // compare newMemos with req.body.newMemos
    // if server has newer memos, send them to client
    // if client has newer memos, update server
    const memosToUpdate: SyncedMemo[] = [];
    const memosToSend: SyncedMemo[] = [];
    for (const memo of req.body.newMemos) {
      const serverMemo = dbResult.rows.find((m) => m.id === memo.id);
      if (!serverMemo || serverMemo.updated_at <= memo.updatedAt) {
        memosToUpdate.push(memo);
      } else if (serverMemo.updated_at > memo.updatedAt) {
        memosToSend.push(mapServerMemo(serverMemo));
      }
    }
    for (const serverMemo of dbResult.rows) {
      if (!req.body.newMemos.find((m: SyncedMemo) => m.id === serverMemo.id)) {
        memosToSend.push(mapServerMemo(serverMemo));
      }
    }
    // update server
    for (const memo of memosToUpdate) {
      const content = encrypt(memo.content);
      const result = await client.query(
        'SELECT * FROM memos WHERE id = $1 AND user_id = $2',
        [memo.id, req.userId],
      );
      if (result.rows.length === 0) {
        // add memo if it doesn't exist
        await client.query(
          'INSERT INTO memos (id, user_id, content, updated_at, created_at, deleted) VALUES ($1, $2, $3, $4, $5, $6)',
          [
            memo.id,
            req.userId,
            content,
            memo.updatedAt,
            memo.createdAt,
            memo.deleted,
          ],
        );
      } else {
        // update memo if it does exist
        await client.query(
          'UPDATE memos SET content = $1, updated_at = $2, deleted = $3 WHERE id = $4',
          [content, memo.updatedAt, memo.deleted, memo.id],
        );
      }
    }
    res.json({ newMemos: memosToSend, newToken: req.newToken });
  } catch (e) {
    logger.error(`SyncError: ${e}`);
    res.status(500).send('Internal server error');
    return;
  } finally {
    client.release();
  }
};

function mapServerMemo(serverMemo: StoredMemo): SyncedMemo {
  const { user_id, updated_at, created_at, content, ...rest } = serverMemo;
  const decryptedContent = decrypt(content);
  return {
    ...rest,
    content: decryptedContent,
    updatedAt: updated_at,
    createdAt: created_at,
  };
}

const encryptionAlgorithm = 'aes-256-cbc';

function decrypt(data: string): string {
  const iv = Buffer.from(data.substring(0, 32), 'hex');
  const key = Buffer.from(process.env.ENCRYPT!, 'hex');
  const content = Buffer.from(data.substring(32), 'hex');
  let deciver = crypto.createDecipheriv(encryptionAlgorithm, key, iv);
  let decrypted = deciver.update(content);
  decrypted = Buffer.concat([decrypted, deciver.final()]);
  return decrypted.toString();
}

function encrypt(data: string): string {
  const iv = crypto.randomBytes(16);
  const key = Buffer.from(process.env.ENCRYPT!, 'hex');
  let cipher = crypto.createCipheriv(encryptionAlgorithm, key, iv);
  let encrypted = cipher.update(data);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + encrypted.toString('hex');
}
