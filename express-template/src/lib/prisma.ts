import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient().$extends({
  result: {
    tossup: {
      mainAnswer: {
        needs: { answer: true }, 
        compute(tossup) {
          return tossup.answer.split('[')[0];
        }
      }
    }
  }
}).$extends({
  result: {
    bonusPart: {
      mainAnswer: {
        needs: { answer: true },
        compute(bonusPart) {
          //excise anything inside brackets or parentheses
          return bonusPart.answer.replace(/(\[.*\]|\(.*\))/g, "")
        }
      }
    }
  }
});

export default prisma;
