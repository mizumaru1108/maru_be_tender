/*
  Warnings:

  - You are about to drop the column `entity_id` on the `client_data` table. All the data in the column will be lost.
  - You are about to drop the `entities` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `client_field_id` to the `authorities` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "client_data" DROP CONSTRAINT "client_data_entity_id_fkey";

-- DropForeignKey
ALTER TABLE "entities" DROP CONSTRAINT "entities_authority_id_fkey";

-- AlterTable
ALTER TABLE "authorities" ADD COLUMN     "client_field_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "client_data" DROP COLUMN "entity_id",
ADD COLUMN     "client_field_id" TEXT;

-- DropTable
DROP TABLE "entities";

-- CreateTable
CREATE TABLE "client_fields" (
    "client_field_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "client_fields_pkey" PRIMARY KEY ("client_field_id")
);

-- AddForeignKey
ALTER TABLE "authorities" ADD CONSTRAINT "authorities_client_field_id_fkey" FOREIGN KEY ("client_field_id") REFERENCES "client_fields"("client_field_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_data" ADD CONSTRAINT "client_data_client_field_id_fkey" FOREIGN KEY ("client_field_id") REFERENCES "client_fields"("client_field_id") ON DELETE SET NULL ON UPDATE CASCADE;
