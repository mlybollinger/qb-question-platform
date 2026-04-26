import { Request, Response } from 'express';
import * as userService from '../services/user.service';

export const getAll = async (_req: Request, res: Response) => {
  const users = await userService.getAll();
  res.json(users);
};

export const getById = async (req: Request, res: Response) => {
  const user = await userService.getById(parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
};

export const create = async (req: Request, res: Response) => {
  try {
    const user = await userService.create(req.body);
    res.status(201).json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const user = await userService.update(parseInt(req.params.id), req.body);
    res.json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await userService.remove(parseInt(req.params.id));
    res.status(204).send();
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
