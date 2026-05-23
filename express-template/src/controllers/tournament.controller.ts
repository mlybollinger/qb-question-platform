import { Request, Response } from 'express';
import * as tournamentService from '../services/tournament.service';

export const getAll = async (_req: Request, res: Response) => {
  const tournaments = await tournamentService.getAll();
  res.json(tournaments);
};

export const getById = async (req: Request, res: Response) => {
  const tournament = await tournamentService.getById(parseInt(req.params.id));
  if (!tournament) return res.status(404).json({ error: 'Tournament not found' });
  res.json(tournament);
};

export const create = async (req: Request, res: Response) => {
  try {
    const tournament = await tournamentService.create(req.body);
    res.status(201).json(tournament);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getQuestionCounts = async (req: Request, res: Response) => {
  try {
    const counts = await tournamentService.getQuestionCounts(parseInt(req.params.id));
    res.status(201).json(counts);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export const update = async (req: Request, res: Response) => {
  try {
    const tournament = await tournamentService.update(parseInt(req.params.id), req.body);
    res.json(tournament);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await tournamentService.remove(parseInt(req.params.id));
    res.status(204).send();
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getCategoryTree = async (req: Request, res: Response) => {
  try {
    const tree = await tournamentService.assembleQuestionTree(parseInt(req.params.id));
    res.json(tree);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await tournamentService.getCategories(parseInt(req.params.id));
    res.json(categories);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export const getDistro = async (req: Request, res: Response) => {
  try {
    const distro = await tournamentService.getDistro(parseInt(req.params.id));
    res.json(distro);
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
  
}