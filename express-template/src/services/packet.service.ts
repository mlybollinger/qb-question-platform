import prisma from '../lib/prisma';
import { QuestionType } from '@prisma/client';

export const getAll = (tournamentId?: number) =>
  prisma.packet.findMany({
    where: tournamentId ? { tournamentId } : undefined,
    include: { packetQuestions: { include: { question: { include: { tossup: true, bonus: true } } } } },
    orderBy: { packetNumber: 'asc' },
  });

export const getById = (id: number) =>
  prisma.packet.findUnique({
    where: { id },
    include: {
      packetQuestions: {
        include: { question: { include: { tossup: true, bonus: true, author: { select: { id: true, username: true } }, category: true } } },
        orderBy: { questionNumber: 'asc' },
      },
    },
  });

export const create = (data: { packetNumber: number; tournamentId: number }) =>
  prisma.packet.create({ data });

export const update = (id: number, data: { packetNumber?: number }) =>
  prisma.packet.update({ where: { id }, data });

export const remove = (id: number) => prisma.packet.delete({ where: { id } });

export const packetize = async (packetId: number) => {
  const packet = await prisma.packet.findUniqueOrThrow({
    where: { id: packetId },
    include: { tournament: { include: { tournamentCategories: true } } },
  });

  const tournament = packet.tournament;
  const constraints = tournament.tournamentCategories;

  // Gather already-assigned question IDs across all packets in this tournament
  const existingAssignments = await prisma.packetQuestion.findMany({
    where: { packet: { tournamentId: tournament.id } },
    select: { questionId: true },
  });
  const assignedIds = new Set(existingAssignments.map((a) => a.questionId));

  // Clear existing assignments for this packet
  await prisma.packetQuestion.deleteMany({ where: { packetId } });

  const created = [];
  // for (const constraint of constraints) {
  //   const questions = await prisma.question.findMany({
  //     where: {
  //       tournamentId: tournament.id,
  //       questionType: constraint.questionType,
  //       id: { notIn: Array.from(assignedIds) },
  //       status: { in: ['written', 'edited', 'proofread'] },
  //     },
  //     take: constraint.numTossups,
  //   });

  //   for (let i = 0; i < questions.length; i++) {
  //     const q = questions[i];
  //     assignedIds.add(q.id);
  //     created.push(
  //       await prisma.packetQuestion.create({
  //         data: {
  //           packetId,
  //           questionId: q.id,
  //           questionType: q.questionType as QuestionType,
  //           questionNumber: i + 1,
  //         },
  //       })
  //     );
  //   }
  // }

  return prisma.packet.findUnique({
    where: { id: packetId },
    include: {
      packetQuestions: {
        include: { question: { include: { tossup: true, bonus: true } } },
        orderBy: { questionNumber: 'asc' },
      },
    },
  });
};
