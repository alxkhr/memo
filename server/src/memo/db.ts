import { pgPool } from '../db';

export async function createMemosTable() {
  // TODO remove drop table
  const query = `
    DROP TABLE IF EXISTS memos;
    CREATE TABLE IF NOT EXISTS memos (
      id VARCHAR(255) NOT NULL,
      user_id INTEGER NOT NULL,
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
    console.error(e);
  } finally {
    client.release();
  }
}
