import { pgPool } from '../db';

export async function createUserTable() {
  const query = `
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      CREATE TABLE IF NOT EXISTS users (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        username VARCHAR(255) NOT NULL UNIQUE,
        key VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
      );
      CREATE TABLE IF NOT EXISTS clients (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id uuid NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        refresh_token VARCHAR(255) NOT NULL,
        access_token VARCHAR(255) NOT NULL,
        user_agent VARCHAR(255) NOT NULL
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
