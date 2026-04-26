/*
  Warnings:

  - Added the required column `leadin` to the `bonus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question_blob` to the `question` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bonus" ADD COLUMN     "leadin" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "question" ADD COLUMN     "question_blob" JSONB NOT NULL;
