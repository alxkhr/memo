import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { pgPool } from '../db';
import { StoredMemo, SyncedMemo } from './memo';

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
  let username: string | undefined;
  try {
    username = await verifyToken(req.headers.authorization);
  } catch (e) {
    res.status(401).send('Invalid token');
    return;
  }
  if (!isSyncRequest(req.body)) {
    res.status(400).send('Invalid request');
    return;
  }
  const lastSync = req.body.lastSync || '1970-01-01T00:00:00.000Z';
  const client = await pgPool.connect();
  let userId: number | undefined;
  try {
    let dbResult = await client.query(
      'SELECT * FROM users WHERE username = $1',
      [username],
    );
    if (dbResult.rows.length === 0) {
      res.status(401).send('Invalid token');
      return;
    }
    userId = dbResult.rows[0].id;
    dbResult = await client.query<StoredMemo>(
      'SELECT * FROM memos WHERE user_id = $1 AND updated_at > $2',
      [userId, lastSync],
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
      const result = await client.query(
        'SELECT * FROM memos WHERE id = $1 AND user_id = $2',
        [memo.id, userId],
      );
      if (result.rows.length === 0) {
        // add memo if it doesn't exist
        await client.query(
          'INSERT INTO memos (id, user_id, content, updated_at, created_at, deleted) VALUES ($1, $2, $3, $4, $5, $6)',
          [
            memo.id,
            userId,
            memo.content,
            memo.updatedAt,
            memo.createdAt,
            memo.deleted,
          ],
        );
      } else {
        // update memo if it does exist
        await client.query(
          'UPDATE memos SET content = $1, updated_at = $2, deleted = $3 WHERE id = $4',
          [memo.content, memo.updatedAt, memo.deleted, memo.id],
        );
      }
    }
    res.json({ newMemos: memosToSend });
  } catch (e) {
    console.error(e);
    res.status(500).send('Internal server error');
    return;
  } finally {
    client.release();
  }
};

function mapServerMemo(serverMemo: StoredMemo): SyncedMemo {
  const { user_id, updated_at, created_at, ...rest } = serverMemo;
  return {
    ...rest,
    updatedAt: updated_at,
    createdAt: created_at,
  };
}

function verifyToken(authHeader?: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!authHeader) return reject('No auth header');
    if (!authHeader.startsWith('Bearer ')) return reject('Invalid auth header');
    const token = authHeader.substring(7);
    jwt.verify(token, process.env.SECRET!, (err, decoded) => {
      if (err) return reject(err);
      resolve(decoded as string);
    });
  });
}