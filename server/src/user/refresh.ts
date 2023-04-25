import { RequestHandler } from 'express';
import { pgPool } from '../db';
import { createAccessToken } from './access-token';
import { createRefreshToken, verifyRefreshToken } from './refresh-token';
import { matchUserAgent } from './user-agent';
import { logger } from '../logger';

export const refreshHandler: RequestHandler = async (req, res) => {
  const refreshCookie: string | undefined = req.cookies.refreshToken;
  if (!refreshCookie) {
    logger.warn('Suspicious refresh attempt: no refresh token cookie');
    res.status(401).send('Unauthorized');
    return;
  }
  let userId: string | undefined;
  try {
    const verification = await verifyRefreshToken(refreshCookie);
    userId = verification.userId;
  } catch (e) {
    // TODO if the token is expired, check the userId nevertheless to identify something suspicious
    res.status(401).send('Unauthorized');
    return;
  }
  if (!userId) {
    res.status(401).send('Unauthorized');
    return;
  }

  const clientId: string | undefined = req.cookies.clientId;
  if (!clientId) {
    logger.warn('Suspicious refresh attempt: no client id cookie');
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
      logger.warn(
        'Suspicious refresh attempt: client does not match user or is unknown',
      );
      res.status(401).send('Unauthorized');
      return;
    }
    // check old refresh token
    if (userClient.refresh_token !== refreshCookie) {
      logger.warn('Suspicious refresh attempt: token does not match client');
      res.status(401).send('Unauthorized');
      return;
    }
    // check access token // TODO outsource substring calculation
    if (userClient.access_token !== req.headers.authorization?.substring(7)) {
      logger.warn('Suspicious refresh attempt: token does not match client');
      res.status(401).send('Unauthorized');
      return;
    }
    // compare the user agents
    if (!matchUserAgent(req.headers['user-agent'], userClient.user_agent)) {
      logger.warn(
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
    logger.error(`RefreshError: ${e}`);
    res.status(500).send('Internal server error');
    return;
  } finally {
    client.release();
  }
};
