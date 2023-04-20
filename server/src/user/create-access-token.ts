import jwt from 'jsonwebtoken';

export function createAccessToken(userId: string): string {
  return jwt.sign(userId, process.env.SECRET!, {
    expiresIn: '3m',
  });
}
