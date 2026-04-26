import prisma from '../lib/prisma';
import { QuestionType, QuestionStatus, Prisma } from '@prisma/client';
import { validateTossupBlob, extractTossupText, validateBonusBlob, extractBonusText } from '../lib/questionValidation';

type SlateNode = { type?: string; text?: string; children?: SlateNode[] };

function validateAndExtractTossup(questionBlob: Prisma.InputJsonValue) {
  const err = validateTossupBlob(questionBlob);
  if (err) throw new Error(err);
  return extractTossupText(questionBlob as SlateNode[]);
}

function validateAndExtractBonus(questionBlob: Prisma.InputJsonValue) {
  const err = validateBonusBlob(questionBlob);
  if (err) throw new Error(err);
  return extractBonusText(questionBlob as SlateNode[]);
}

export const getAll = (filters?: {
  tournamentId?: number;
  authorId?: number;
  questionType?: QuestionType;
  status?: QuestionStatus;
}) =>
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
  questionBlob: Prisma.InputJsonValue;
}) => {
  const { questionBlob, ...questionData } = data;

  if (data.questionType === 'tossup') {
    const { questionText, answer } = validateAndExtractTossup(questionBlob);
    return prisma.question.create({
      data: { ...questionData, questionBlob, tossup: { create: { questionText, answer } } },
      include: { tossup: true, bonus: true },
    });
  }

  if (data.questionType === 'bonus') {
    const bonusFields = validateAndExtractBonus(questionBlob);
    return prisma.question.create({
      data: { ...questionData, questionBlob, bonus: { create: bonusFields } },
      include: { tossup: true, bonus: true },
    });
  }

  throw new Error(`Unknown question type: ${data.questionType}`);
};

export const update = async (
  id: number,
  data: {
    categoryId?: number;
    status?: QuestionStatus;
    questionBlob?: Prisma.InputJsonValue;
  }
) => {
  const { questionBlob, ...questionData } = data;

  const existing = await prisma.question.findUniqueOrThrow({ where: { id }, select: { questionType: true } });

  let tossupUpdate: { questionText: string; answer: string } | undefined;
  let bonusUpdate: ReturnType<typeof extractBonusText> | undefined;

  if (questionBlob !== undefined) {
    if (existing.questionType === 'tossup') {
      tossupUpdate = validateAndExtractTossup(questionBlob);
    } else {
      bonusUpdate = validateAndExtractBonus(questionBlob);
    }
  }

  return prisma.question.update({
    where: { id },
    data: {
      ...questionData,
      ...(questionBlob !== undefined ? { questionBlob } : {}),
      tossup: tossupUpdate ? { update: tossupUpdate } : undefined,
      bonus: bonusUpdate ? { update: bonusUpdate } : undefined,
    },
    include: { tossup: true, bonus: true },
  });
};

export const remove = (id: number) => prisma.question.delete({ where: { id } });
