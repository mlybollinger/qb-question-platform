import { Request, Response } from 'express';
import * as questionService from '../services/question.service';
import { QuestionType, QuestionStatus } from '@prisma/client';

export const getAll = async (req: Request, res: Response) => {
  const { tournamentId, authorId, questionType, status } = req.query;
  const questions = await questionService.getAll({
    tournamentId: tournamentId ? parseInt(tournamentId as string) : undefined,
    authorId: authorId ? parseInt(authorId as string) : undefined,
    questionType: questionType as QuestionType | undefined,
    status: status as QuestionStatus | undefined,
  });
  res.json(questions);
};

export const getById = async (req: Request, res: Response) => {
  const question = await questionService.getById(parseInt(req.params.id));
  if (!question) return res.status(404).json({ error: 'Question not found' });
  res.json(question);
};

export const create = async (req: Request, res: Response) => {
  try {
    const question = await questionService.create(req.body);
    res.status(201).json(question);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const question = await questionService.update(parseInt(req.params.id), req.body);
    res.json(question);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await questionService.remove(parseInt(req.params.id));
    res.status(204).send();
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
