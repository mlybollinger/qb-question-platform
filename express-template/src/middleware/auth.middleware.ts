import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: number;
  username?: string;
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header' });
  }

  const token = header.slice(7);
  const secret = process.env.JWT_SECRET;
  if (!secret) return res.status(500).json({ error: 'Server misconfiguration' });

  try {
    const payload = jwt.verify(token, secret) as jwt.JwtPayload;
    req.userId = payload.sub as unknown as number;
    req.username = payload.username as string;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
