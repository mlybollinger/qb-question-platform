-- AlterTable
ALTER TABLE "packet_distribution_constraints" ADD COLUMN     "category_id" INTEGER;

-- AddForeignKey
ALTER TABLE "packet_distribution_constraints" ADD CONSTRAINT "packet_distribution_constraints_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
