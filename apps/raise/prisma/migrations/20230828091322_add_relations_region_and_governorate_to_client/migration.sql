-- AlterTable
ALTER TABLE "client_data" ADD COLUMN     "governorate_id" TEXT,
ADD COLUMN     "region_id" TEXT;

-- AddForeignKey
ALTER TABLE "client_data" ADD CONSTRAINT "client_data_governorate_id_fkey" FOREIGN KEY ("governorate_id") REFERENCES "governorates"("governorate_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_data" ADD CONSTRAINT "client_data_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "regions"("region_id") ON DELETE SET NULL ON UPDATE CASCADE;
