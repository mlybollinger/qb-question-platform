import prisma from '../lib/prisma';
import { Prisma, TournamentCategory } from '@prisma/client';
import { getAll as getAllQuestions } from "./question.service";
import { Category, Question } from '@prisma/client';
import { getCategoryTree } from '../controllers/tournament.controller';

export const getAll = () => prisma.tournament.findMany();

interface CategoryTreeNode extends Category {
  children: CategoryTreeNode[]
}

interface CategoryTree {
  id: string,
  children: CategoryTreeNode[]
}






export const getById = (id: number) => prisma.tournament.findUnique({
    where: { id },
    include: { roles: { include: { user: true } }, tournamentCategories: true },
});

export const getQuestionCounts = (id: number) => prisma.question.groupBy({
  by: ['status'],
  where: {tournamentId: id},
  _count: {
    _all: true
  }
})




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

export const getCategories = async (id: number) => {
  const tournamentCategories = await prisma.tournamentCategory.findMany({
    distinct: ['categoryId'],
    where: {tournamentId: id },
    include: { category: true }
  });

  const categories = tournamentCategories.map((entry) => {
    return entry.category;
  });

  return categories;

  }

  


export const assembleQuestionTree = async (id: number): Promise<CategoryTree> => {
  const categories = await prisma.category.findMany({
    where: { 
      tournamentCategories: {
        some: {
          tournamentId: id
        }
      }
    },
    include: {
      tournamentCategories: true, 
      questions: {
        where: {
          tournamentId: id
        },
        include: {
          tossup: true,
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              username: true
            }
          },
          bonus: {
            include: {
              parts: true
            }

          }
        }
      }
    }
  })

  const trees = assembleTreeHelper(categories)
  const myTree = { id: "root", children: trees }
  return myTree;
}


const assembleTreeHelper =  (categories: Category[], parentId: number | null = null): CategoryTreeNode[] => {
  return categories.filter((category) => category.parentId === parentId)
    .map((cat: Category) => ({...cat,  children: assembleTreeHelper(categories, cat.id)}))
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
    if (node.parent?.id && node.parent?.id in newTree) {
        runningTree[node.parent?.id].push(node)
    } else if (!node.parent?.id) {
      terminalNodes.push({ ...node, children: runningTree[node.id] })
    } else {
      runningTree[node.parent?.id] = [node]
    }
  }

  const restOfTree: any = await assembleQuestionTreeHelper(newTree);
  return [...terminalNodes, ...restOfTree];

}