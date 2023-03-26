import { pgPool } from "../db";

export async function createUserTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      key VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL
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