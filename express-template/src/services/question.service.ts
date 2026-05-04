import prisma from '../lib/prisma';
import { QuestionType, QuestionStatus } from '@prisma/client';

export const getAll = (filters?: { tournamentId?: number; authorId?: number; questionType?: QuestionType; status?: QuestionStatus }) =>
  prisma.question.findMany({
    where: filters,
    include: { tossup: true, bonus: true, author: { select: { id: true, username: true } }, category: true },
  });

export const getById = (id: number) =>
  prisma.question.findUnique({
    where: { id },
    include: { tossup: true, bonus: true, author: { select: { id: true, username: true } }, category: true },
  });

export const create = async (data: {
  authorId: number;
  categoryId: number;
  questionType: QuestionType;
  tournamentId: number;
  status?: QuestionStatus;
  tossup?: { questionText: string; answer: string };
  bonus?: {
    bonusLeadin?: string;
    part1Text: string; part1Answer: string;
    part2Text: string; part2Answer: string;
    part3Text: string; part3Answer: string;
  };
}) => {
  const { tossup, bonus, ...questionData } = data;
  return prisma.question.create({
    data: {
      ...questionData,
      tossup: tossup ? { create: tossup } : undefined,
      bonus: bonus ? { create: bonus } : undefined,
    },
    include: { tossup: true, bonus: true },
  });
};

export const update = async (
  id: number,
  data: {
    categoryId?: number;
    status?: QuestionStatus;
    tossup?: { questionText?: string; answer?: string };
    bonus?: {
      bonusLeadin?: string;
      part1Text?: string; part1Answer?: string;
      part2Text?: string; part2Answer?: string;
      part3Text?: string; part3Answer?: string;
    };
  }
) => {
  const { tossup, bonus, ...questionData } = data;
  return prisma.question.update({
    where: { id },
    data: {
      ...questionData,
      tossup: tossup ? { update: tossup } : undefined,
      bonus: bonus ? { update: bonus } : undefined,
    },
    include: { tossup: true, bonus: true },
  });
};

export const remove = (id: number) => prisma.question.delete({ where: { id } });
