/*
  Warnings:

  - You are about to drop the column `part_1_answer` on the `bonus` table. All the data in the column will be lost.
  - You are about to drop the column `part_1_text` on the `bonus` table. All the data in the column will be lost.
  - You are about to drop the column `part_2_answer` on the `bonus` table. All the data in the column will be lost.
  - You are about to drop the column `part_2_text` on the `bonus` table. All the data in the column will be lost.
  - You are about to drop the column `part_3_answer` on the `bonus` table. All the data in the column will be lost.
  - You are about to drop the column `part_3_text` on the `bonus` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "bonus" DROP COLUMN "part_1_answer",
DROP COLUMN "part_1_text",
DROP COLUMN "part_2_answer",
DROP COLUMN "part_2_text",
DROP COLUMN "part_3_answer",
DROP COLUMN "part_3_text";

-- CreateTable
CREATE TABLE "bonus_part" (
    "id" SERIAL NOT NULL,
    "bonus_id" INTEGER NOT NULL,
    "part_number" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "answer" TEXT NOT NULL,

    CONSTRAINT "bonus_part_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "bonus_part" ADD CONSTRAINT "bonus_part_bonus_id_fkey" FOREIGN KEY ("bonus_id") REFERENCES "bonus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
