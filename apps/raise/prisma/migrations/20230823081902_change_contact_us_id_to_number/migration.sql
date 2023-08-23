/*
  Warnings:

  - The primary key for the `contact_us` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `contact_us_id` column on the `contact_us` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "contact_us" DROP CONSTRAINT "contact_us_pkey",
DROP COLUMN "contact_us_id",
ADD COLUMN     "contact_us_id" SERIAL NOT NULL,
ADD CONSTRAINT "contact_us_pkey" PRIMARY KEY ("contact_us_id");
