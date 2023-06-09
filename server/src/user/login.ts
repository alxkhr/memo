import jwt from 'jsonwebtoken';
import { pgPool } from '../db';
import bcrypt from 'bcrypt';
import { RequestHandler } from 'express';
import { createAccessToken } from './access-token';
import { createRefreshToken } from './refresh-token';
import { matchUserAgent } from './user-agent';
import { logger } from '../logger';

export const verifyCredentialsHandler: RequestHandler = async (
  req,
  res,
  next,
) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).send('Username and password are required');
    return;
  }
  // open database connection
  const client = await pgPool.connect();
  try {
    // verify the credentials
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
    req.userId = user.rows[0].id;
  } catch (e) {
    logger.error(`VerifyCredentialsError: ${e}`);
    res.status(500).send('Internal server error');
    return;
  } finally {
    // close database connection
    client.release();
  }
  // if everything is valid, login next
  next();
};

export const loginHandler: RequestHandler = async (req, res) => {
  if (!req.userId) {
    res.status(401).send('Unauthorized');
    return;
  }
  // check if client is already known
  const clientId: string | undefined = req.cookies.clientId;
  // create new tokens
  const accessToken = createAccessToken(req.userId);
  const client = await pgPool.connect();
  try {
    // if client is already known
    if (clientId) {
      // validate the client
      const clientResult = await client.query(
        'SELECT * FROM clients WHERE id = $1 AND user_id = $2',
        [clientId, req.userId],
      );
      if (clientResult.rows.length === 0) {
        logger.warn('Suspicious login attempt: Client not found');
        res.status(401).send('Unauthorized');
        return;
      }
      // compare the user agent
      if (
        !matchUserAgent(
          req.headers['user-agent'],
          clientResult.rows[0].user_agent,
        )
      ) {
        logger.warn('Suspicious login attempt: User agent does not match');
        res.status(401).send('Unauthorized');
        return;
      }
      // update the client
      const refreshToken = createRefreshToken(res, req.userId);
      await client.query(
        'UPDATE clients SET access_token = $1, refresh_token = $2 WHERE id = $3',
        [accessToken, refreshToken, clientId],
      );
    } else {
      // if not, create a new client
      const refreshToken = createRefreshToken(res, req.userId);
      const newClient = await client.query(
        'INSERT INTO clients (user_id, access_token, refresh_token, user_agent) VALUES ($1, $2, $3, $4) RETURNING *',
        [req.userId, accessToken, refreshToken, req.headers['user-agent']],
      );
      res.cookie('clientId', newClient.rows[0].id, {
        httpOnly: true,
        sameSite: 'strict',
        secure: true,
      });
    }
  } catch (e) {
    logger.error(`LoginError: ${e}`);
    res.status(500).send('Internal server error');
    return;
  } finally {
    client.release();
  }
  res.json({ newToken: accessToken });
};
