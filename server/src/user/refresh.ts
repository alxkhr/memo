import { RequestHandler } from 'express';
import { pgPool } from '../db';
import { verifyToken } from './verify-token';
import { createAccessToken } from './create-access-token';
import { createRefreshToken } from './create-refresh-token';
import { matchUserAgent } from './compare-user-agent';

export const refreshHandler: RequestHandler = async (req, res) => {
  const refreshCookie: string | undefined = req.cookies.refreshToken;
  if (!refreshCookie) {
    console.warn('Suspicious refresh attempt: no refresh token cookie');
    res.status(401).send('Unauthorized');
    return;
  }
  let userId: string | undefined;
  let token: string | undefined;
  try {
    const verification = await verifyToken(refreshCookie);
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
    console.warn('Suspicious refresh attempt: no client id cookie');
    res.status(401).send('Unauthorized');
    return;
  }

  const client = await pgPool.connect();
  try {
    const clientResult = await client.query(
      'SELECT * FROM clients WHERE id = $1 AND user_id = $2',
      [clientId, userId],
    );
    const userClient = clientResult.rows[0];
    // verify client
    if (!userClient) {
      console.warn(
        'Suspicious refresh attempt: client does not match user or is unknown',
      );
      res.status(401).send('Unauthorized');
      return;
    }
    // check old refresh token
    if (userClient.refresh_token !== token) {
      console.warn('Suspicious refresh attempt: token does not match client');
      res.status(401).send('Unauthorized');
      return;
    }
    // check access token
    if (userClient.access_token !== req.headers.authorization) {
      console.warn('Suspicious refresh attempt: token does not match client');
      res.status(401).send('Unauthorized');
      return;
    }
    // compare the user agents
    if (!matchUserAgent(req.headers['user-agent'], userClient.user_agent)) {
      console.warn(
        'Suspicious refresh attempt: user agent does not match client',
      );
      res.status(401).send('Unauthorized');
      return;
    }
    // create new access token
    const newAccessToken = createAccessToken(userId);
    // create new refresh token
    const newRefreshToken = createRefreshToken(res, userId);
    // update the client
    await client.query(
      'UPDATE clients SET access_token = $1, refresh_token = $2 WHERE id = $3',
      [newAccessToken, newRefreshToken, clientId],
    );
    res.json({ newToken: newAccessToken });
  } catch (e) {
    console.error(e);
    res.status(500).send('Internal server error');
    return;
  } finally {
    client.release();
  }
};
