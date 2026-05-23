/*
  Warnings:

  - You are about to drop the `category_relation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "category_relation" DROP CONSTRAINT "category_relation_child_category_id_fkey";

-- DropForeignKey
ALTER TABLE "category_relation" DROP CONSTRAINT "category_relation_parent_category_id_fkey";

-- AlterTable
ALTER TABLE "category" ADD COLUMN     "parentId" INTEGER;

-- DropTable
DROP TABLE "category_relation";

-- AddForeignKey
ALTER TABLE "category" ADD CONSTRAINT "category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
