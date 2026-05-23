/*
  Warnings:

  - A unique constraint covering the columns `[child_category_id]` on the table `category_relation` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "category_relation" DROP CONSTRAINT "category_relation_child_category_id_fkey";

-- DropForeignKey
ALTER TABLE "category_relation" DROP CONSTRAINT "category_relation_parent_category_id_fkey";

-- AlterTable
ALTER TABLE "category_relation" ALTER COLUMN "child_category_id" DROP NOT NULL,
ALTER COLUMN "parent_category_id" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "category_relation_child_category_id_key" ON "category_relation"("child_category_id");

-- AddForeignKey
ALTER TABLE "category_relation" ADD CONSTRAINT "category_relation_child_category_id_fkey" FOREIGN KEY ("child_category_id") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_relation" ADD CONSTRAINT "category_relation_parent_category_id_fkey" FOREIGN KEY ("parent_category_id") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
