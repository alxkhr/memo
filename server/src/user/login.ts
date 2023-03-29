import jwt from 'jsonwebtoken';
import { pgPool } from '../db';
import bcrypt from 'bcrypt';
import { RequestHandler } from 'express';

export const loginHandler: RequestHandler = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).send('Username and password are required');
    return;
  }
  // open database connection
  const client = await pgPool.connect();
  try {
    // verify the user
    const user = await client.query('SELECT * FROM users WHERE username = $1', [
      username,
    ]);
    if (user.rows.length === 0) {
      res.status(401).send('Invalid username or password');
      return;
    }
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      res.status(401).send('Invalid username or password');
      return;
    }
  } catch (e) {
    console.error(e);
    res.status(500).send('Internal server error');
    return;
  } finally {
    // close database connection
    client.release();
  }
  // if it is, return the user object and a token
  const token = jwt.sign(username, process.env.SECRET!);
  res.json({ user: { username }, token });
};
