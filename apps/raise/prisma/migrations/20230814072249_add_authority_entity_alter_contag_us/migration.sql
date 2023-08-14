/*
  Warnings:

  - You are about to drop the column `project_name` on the `contact_us` table. All the data in the column will be lost.
  - You are about to drop the column `receiver_id` on the `contact_us` table. All the data in the column will be lost.
  - You are about to drop the column `sender_id` on the `contact_us` table. All the data in the column will be lost.
  - You are about to drop the `inquiry_type` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `inquiry_type` on table `contact_us` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "contact_us" DROP CONSTRAINT "message_inquiry_type_fkey";

-- DropForeignKey
ALTER TABLE "contact_us" DROP CONSTRAINT "message_receiver_id_fkey";

-- DropForeignKey
ALTER TABLE "contact_us" DROP CONSTRAINT "message_sender_id_fkey";

-- AlterTable
ALTER TABLE "contact_us" RENAME CONSTRAINT "contcatus_pkey" TO "contact_us_pkey";
ALTER TABLE "contact_us" DROP COLUMN "project_name";
ALTER TABLE "contact_us" DROP COLUMN "receiver_id";
ALTER TABLE "contact_us" DROP COLUMN "sender_id";
ALTER TABLE "contact_us" ALTER COLUMN "inquiry_type" SET NOT NULL;
ALTER TABLE "contact_us" ALTER COLUMN "inquiry_type" SET DATA TYPE TEXT;
ALTER TABLE "contact_us" ALTER COLUMN "message" SET DATA TYPE VARCHAR;

-- DropTable
DROP TABLE "inquiry_type";

-- CreateTable
CREATE TABLE "authorities" (
    "authority_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "authorities_pkey" PRIMARY KEY ("authority_id")
);

-- CreateTable
CREATE TABLE "entities" (
    "entity_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "authority_id" TEXT NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "entities_pkey" PRIMARY KEY ("entity_id")
);

-- AddForeignKey
ALTER TABLE "entities" ADD CONSTRAINT "entities_authority_id_fkey" FOREIGN KEY ("authority_id") REFERENCES "authorities"("authority_id") ON DELETE RESTRICT ON UPDATE CASCADE;
