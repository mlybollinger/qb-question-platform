/*
  Warnings:

  - You are about to drop the `packet_distribution_constraints` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "packet_distribution_constraints" DROP CONSTRAINT "packet_distribution_constraints_category_id_fkey";

-- DropForeignKey
ALTER TABLE "packet_distribution_constraints" DROP CONSTRAINT "packet_distribution_constraints_tournament_id_fkey";

-- DropTable
DROP TABLE "packet_distribution_constraints";

-- CreateTable
CREATE TABLE "tournament_category" (
    "id" SERIAL NOT NULL,
    "tournament_id" INTEGER NOT NULL,
    "category_id" INTEGER,
    "num_bonuses" INTEGER,
    "num_tossups" INTEGER,
    "display_order" INTEGER NOT NULL,

    CONSTRAINT "tournament_category_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tournament_category" ADD CONSTRAINT "tournament_category_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournament_category" ADD CONSTRAINT "tournament_category_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
