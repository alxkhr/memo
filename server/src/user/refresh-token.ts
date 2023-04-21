import { Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export function createRefreshToken(res: Response, userId: string): string {
  const newRefreshToken = jwt.sign({ userId }, process.env.SECRET!, {
    expiresIn: '30d',
  });
  // set the new refresh token cookie only for the url api/user/refresh
  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    path: '/api/user/refresh',
  });
  return newRefreshToken;
}

export function verifyRefreshToken(token: string): Promise<{ userId: string }> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.SECRET!, (error, decoded) => {
      if (!decoded || error) return reject({ error, decoded });
      const { userId } = decoded as JwtPayload;
      resolve({ userId });
    });
  });
}
