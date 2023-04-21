import jwt, { JwtPayload } from 'jsonwebtoken';

export function verifyAccessToken(
  authHeader?: string,
): Promise<{ userId: string; token: string }> {
  return new Promise((resolve, reject) => {
    if (!authHeader) return reject('No auth header');
    if (!authHeader.startsWith('Bearer ')) return reject('Invalid auth header');
    const token = authHeader.substring(7);
    jwt.verify(token, process.env.SECRET!, (error, decoded) => {
      if (!decoded || error) return reject({ error, decoded, token });
      const { userId } = decoded as JwtPayload;
      resolve({ userId, token });
    });
  });
}

export function createAccessToken(userId: string): string {
  return jwt.sign({ userId }, process.env.SECRET!, {
    expiresIn: '3m',
  });
}
