/*
  Warnings:

  - You are about to drop the `authority` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "client_data" ADD COLUMN     "authority_id" TEXT,
ADD COLUMN     "entity_id" TEXT;

-- DropTable
DROP TABLE "authority";

-- AddForeignKey
ALTER TABLE "client_data" ADD CONSTRAINT "client_data_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "entities"("entity_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_data" ADD CONSTRAINT "client_data_authority_id_fkey" FOREIGN KEY ("authority_id") REFERENCES "authorities"("authority_id") ON DELETE SET NULL ON UPDATE CASCADE;
