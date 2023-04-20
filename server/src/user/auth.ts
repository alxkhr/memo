import { pgPool } from '../db';
import { RequestHandler } from 'express';
import { verifyToken } from './verify-token';
import { createAccessToken } from './create-access-token';
import { matchUserAgent } from './compare-user-agent';

export const authMiddleware: RequestHandler = async (req, res, next) => {
  let userId: string | undefined;
  let token: string | undefined;
  try {
    const verification = await verifyToken(req.headers.authorization);
    userId = verification.userId;
    token = verification.token;
  } catch (e) {
    res.status(401).send('Unauthorized');
    return;
  }
  if (!userId || !token) {
    res.status(401).send('Unauthorized');
    return;
  }

  const clientId: string | undefined = req.cookies.clientId;
  if (!clientId) {
    console.warn('Suspicious Request: no client id cookie');
    res.status(401).send('Unauthorized');
    return;
  }

  const client = await pgPool.connect();
  let newToken: string | undefined;
  try {
    const clientResult = await client.query(
      'SELECT * FROM clients WHERE id = $1 AND user_id = $2',
      [clientId, userId],
    );
    const userClient = clientResult.rows[0];

    // verify client
    if (!userClient) {
      console.warn(
        'Suspicious Request: client does not match user or is unknown',
      );
      res.status(401).send('Unauthorized');
      return;
    }
    // double check token
    if (userClient.access_token !== token) {
      console.warn('Suspicious Request: token does not match client');
      res.status(401).send('Unauthorized');
      return;
    }
    if (!matchUserAgent(req.headers['user-agent'], userClient.user_agent)) {
      console.warn('Suspicious Request: user agent does not match client');
      res.status(401).send('Unauthorized');
      return;
    }
    // create new access token
    newToken = createAccessToken(userId);
    // update the access token in the database
    await client.query('UPDATE clients SET access_token = $1 WHERE id = $2', [
      newToken,
      clientId,
    ]);
  } catch (e) {
    console.error(e);
    res.status(500).send('Internal server error');
    return;
  } finally {
    client.release();
  }

  req.userId = userId;
  req.newToken = newToken;
  next();
};
