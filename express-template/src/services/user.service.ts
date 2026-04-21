import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';

export const getAll = () =>
  prisma.user.findMany({ select: { id: true, firstName: true, lastName: true, username: true, email: true } });

export const getById = (id: number) =>
  prisma.user.findUnique({
    where: { id },
    select: { id: true, firstName: true, lastName: true, username: true, email: true },
  });

export const create = async (data: {
  firstName: string;
  lastName: string;
  username: string;
  email?: string;
  password: string;
}) => {
  const passwordHash = await bcrypt.hash(data.password, 10);
  return prisma.user.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      email: data.email,
      passwordHash,
    },
    select: { id: true, firstName: true, lastName: true, username: true, email: true },
  });
};

export const update = (
  id: number,
  data: Partial<{ firstName: string; lastName: string; username: string; email: string }>
) =>
  prisma.user.update({
    where: { id },
    data,
    select: { id: true, firstName: true, lastName: true, username: true, email: true },
  });

export const remove = (id: number) => prisma.user.delete({ where: { id } });
