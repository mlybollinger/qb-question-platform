import { Request, Response } from 'express';
import * as questionService from '../services/question.service';
import { QuestionType, QuestionStatus } from '@prisma/client';
import { validateTossupFields, validateBonusFields, ValidationErrors } from '../lib/questionValidation';
import { parseTossup, parseBonus } from '../lib/questionParser';

function runValidation(body: any): ValidationErrors {
  if (body.tossup) {
    const { questionText, answer } = body.tossup;
    if (questionText !== undefined || answer !== undefined) {
      return validateTossupFields({ questionText: questionText ?? '', answer: answer ?? '' });
    }
  }
  if (body.bonus) {
    const { parts } = body.bonus;
    if (Array.isArray(parts) && parts.some((p: any) => p.answer !== undefined)) {
      return validateBonusFields({ parts: parts.map((p: any) => ({ answer: p.answer ?? '' })) });
    }
  }
  return {};
}

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
  const { rawText, questionType, authorId, categoryId, tournamentId } = req.body;

  if (rawText) {
    if (!questionType) return res.status(400).json({ error: 'questionType is required when rawText is provided' });

    if (questionType === 'tossup') {
      const parsed = parseTossup(rawText);
      if (!parsed) return res.status(400).json({ error: 'Failed to parse tossup: expected "...question text...\nANSWER: ...answer..."' });
      try {
        const question = await questionService.create({ authorId, categoryId, questionType, tournamentId, tossup: parsed });
        return res.status(201).json(question);
      } catch (err: any) {
        return res.status(400).json({ error: err.message });
      }
    }

    if (questionType === 'bonus') {
      const parsed = parseBonus(rawText);
      if (!parsed) return res.status(400).json({ error: 'Failed to parse bonus: expected "leadin\\n[10e/m/h] text\\nANSWER: answer" × 3' });
      try {
        const question = await questionService.create({ authorId, categoryId, questionType, tournamentId, bonus: parsed });
        return res.status(201).json(question);
      } catch (err: any) {
        return res.status(400).json({ error: err.message });
      }
    }

    return res.status(400).json({ error: 'questionType must be "tossup" or "bonus"' });
  }

  const errors = runValidation(req.body);
  if (Object.keys(errors).length > 0) return res.status(400).json({ errors });
  try {
    const question = await questionService.create(req.body);
    res.status(201).json(question);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const update = async (req: Request, res: Response) => {
  const errors = runValidation(req.body);
  if (Object.keys(errors).length > 0) return res.status(400).json({ errors });
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

