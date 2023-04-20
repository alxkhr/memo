import jwt from 'jsonwebtoken';

export function verifyToken(
  authHeader?: string,
): Promise<{ userId: string; token: string }> {
  return new Promise((resolve, reject) => {
    if (!authHeader) return reject('No auth header');
    if (!authHeader.startsWith('Bearer ')) return reject('Invalid auth header');
    const token = authHeader.substring(7);
    jwt.verify(token, process.env.SECRET!, (error, decoded) => {
      if (error) return reject({ error, userId: decoded as string, token });
      resolve({ userId: decoded as string, token });
    });
  });
}
