import prisma from '../lib/prisma';
import { Prisma } from '@prisma/client';

export const getAll = () => prisma.tournament.findMany();

export const getById = (id: number) =>
  prisma.tournament.findUnique({
    where: { id },
    include: { packets: true, roles: { include: { user: true } }, distributionConstraints: true },
  });

export const create = (data: {
  name: string;
  metadata?: Prisma.InputJsonValue;
  dueDate?: Date;
  numberOfPackets?: number;
  questionsPerPacket?: number;
  distribution?: Prisma.InputJsonValue;
}) => prisma.tournament.create({ data });

export const update = (
  id: number,
  data: Partial<{
    name: string;
    metadata: Prisma.InputJsonValue;
    dueDate: Date;
    numberOfPackets: number;
    questionsPerPacket: number;
    distribution: Prisma.InputJsonValue;
  }>
) => prisma.tournament.update({ where: { id }, data });

export const remove = (id: number) => prisma.tournament.delete({ where: { id } });
