import { Request, Response } from 'express';
import * as authService from '../services/auth.service';

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required' });
  }
  try {
    const result = await authService.login(username, password);
    res.json(result);
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
};
