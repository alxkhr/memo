import { pgPool } from '../db';
import { logger } from '../logger';

export async function createMemosTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS memos (
      id VARCHAR(255) NOT NULL,
      user_id uuid NOT NULL,
      content TEXT NOT NULL,
      created_at VARCHAR(255) NOT NULL,
      updated_at VARCHAR(255) NOT NULL, 
      deleted BOOLEAN NOT NULL,
      PRIMARY KEY (user_id, id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `;
  const client = await pgPool.connect();
  try {
    await client.query(query);
  } catch (e) {
    logger.error(`DatabaseError: ${e}`);
  } finally {
    client.release();
  }
}
