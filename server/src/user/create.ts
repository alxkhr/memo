import { pgPool } from '../db';
import bcrypt from 'bcrypt';
import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

export const createHandler: RequestHandler = async (req, res) => {
  const { username, password, key } = req.body;
  if (!username || !password || !key) {
    res.status(400).send('Username, password and key are required');
    return;
  }
  if (!process.env.KEYS?.split(',').includes(key)) {
    res.status(401).send('Invalid key');
    return;
  }
  const client = await pgPool.connect();
  try {
    // check if username already exists
    const existingName = await client.query(
      'SELECT * FROM users WHERE username = $1',
      [username],
    );
    if (existingName.rows.length > 0) {
      res.status(400).send('Username already exists');
      return;
    }
    // check if key already used
    const existingKey = await client.query(
      'SELECT * FROM users WHERE key = $1',
      [key],
    );
    if (existingKey.rows.length > 0) {
      res.status(400).send('Key already used');
      return;
    }
    // encrypt the password
    const encryptedPassword = await bcrypt.hash(password, 10);
    // insert the new user into the database
    await client.query(
      'INSERT INTO users (username, password, key) VALUES ($1, $2, $3)',
      [username, encryptedPassword, key],
    );
    // TODO also encryt the users id, maybe only the id
    // TODO outsource the token creation
    const token = jwt.sign(username, process.env.SECRET!);
    res.json({ user: { username }, token });
  } catch (e) {
    console.error(e);
    res.status(500).send('Internal server error');
    return;
  } finally {
    client.release();
  }
};
