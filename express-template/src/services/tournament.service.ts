import prisma from '../lib/prisma';
import { Prisma } from '@prisma/client';
import { getAll as getAllQuestions } from "./question.service";

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

export const getDistro = (id: number) => {
  return prisma.tournament.findUnique({
    where: { id },
    select: { distribution: true }
  })
}

export const assembleQuestionTree = async (id: number) => {

    const leafNodes = await prisma.category.findMany({
      where: {
        distributionConstraints: {
          some: {
            tournamentId: id
          }
        }
      },
      include: {
        parent: true,
        questions: {
          where: {
            tournamentId: id
          },
          include: {
            tossup: true,
            bonus: {
              include: {
                parts: true
              }
            },
            author: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        },
        distributionConstraints: true
      }
    })

    const terminalNodes: any[] = []
    const runningTree: {[key: number]: any }= {}

    for (const node of leafNodes) {
      if (node.parent?.parentCategoryId && node.parent?.parentCategoryId in runningTree) {
        runningTree[node.parent?.parentCategoryId].push(node)
      } else if (!node.parent?.parentCategoryId) {
        terminalNodes.push({ ...node, children: [] });
      } else {
        runningTree[node.parent?.parentCategoryId] = [node];
      }
    }
    const restOfTree = await assembleQuestionTreeHelper(runningTree)
    return [ ...terminalNodes, ...restOfTree ]
}


const assembleQuestionTreeHelper = async (runningTree: any) => {
  const parentIds = Object.keys(runningTree);
  if (!parentIds.length) {
    return [];
  }
  const nodes = await prisma.category.findMany({
    where: {
      id: {
        in: parentIds.map((id) => parseInt(id)),
      }
    },
    include: {
      parent: true
    }
  })

  const newTree = { };
  const terminalNodes = [] 

  for (const node of nodes) {
    if (node.parent?.parentCategoryId && node.parent?.parentCategoryId in newTree) {
        runningTree[node.parent?.parentCategoryId].push(node)
    } else if (!node.parent?.parentCategoryId) {
      terminalNodes.push({ ...node, children: runningTree[node.id] })
    } else {
      runningTree[node.parent?.parentCategoryId] = [node]
    }
  }

  const restOfTree: any = await assembleQuestionTreeHelper(newTree);
  return [...terminalNodes, ...restOfTree];

}