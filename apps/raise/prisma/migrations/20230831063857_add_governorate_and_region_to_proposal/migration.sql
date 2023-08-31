-- AlterTable
ALTER TABLE "proposal" ADD COLUMN     "governorate_id" TEXT,
ADD COLUMN     "region_id" TEXT;

-- AddForeignKey
ALTER TABLE "proposal" ADD CONSTRAINT "proposal_governorate_id_fkey" FOREIGN KEY ("governorate_id") REFERENCES "governorates"("governorate_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposal" ADD CONSTRAINT "proposal_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "regions"("region_id") ON DELETE SET NULL ON UPDATE CASCADE;
