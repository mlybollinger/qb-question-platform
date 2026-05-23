import prisma from '../lib/prisma';
import { QuestionType, QuestionStatus } from '@prisma/client';

const questionInclude = {
  tossup: true,
  bonus: { include: { parts: true } },
  author: { select: { id: true, username: true } },
  category: true,
} as const;

export const getAll = (filters?: { tournamentId?: number; authorId?: number; questionType?: QuestionType; status?: QuestionStatus }) =>
  prisma.question.findMany({
    where: filters,
    include: questionInclude,
  });

export const getById = (id: number) =>
  prisma.question.findUnique({
    where: { id },
    include: questionInclude,
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
    parts: { partNumber: number; text: string; answer: string }[];
  };
}) => {
  const { tossup, bonus, ...questionData } = data;

  return prisma.question.create({
    data: {
      ...questionData,
      tossup: tossup ? { create: tossup } : undefined,
      bonus: bonus ? {
        create: {
          bonusLeadin: bonus.bonusLeadin,
          parts: { create: bonus.parts },
        },
      } : undefined,
    },
    include: questionInclude,
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
      parts?: { partNumber: number; text: string; answer: string }[];
    };
  }
) => {
  const { tossup, bonus, ...questionData } = data;
  return prisma.question.update({
    where: { id },
    data: {
      ...questionData,
      tossup: tossup ? { update: tossup } : undefined,
      bonus: bonus ? {
        update: {
          bonusLeadin: bonus.bonusLeadin,
          parts: bonus.parts ? {
            deleteMany: {},
            create: bonus.parts,
          } : undefined,
        },
      } : undefined,
    },
    include: questionInclude,
  });
};

export const remove = (id: number) => prisma.question.delete({ where: { id } });
