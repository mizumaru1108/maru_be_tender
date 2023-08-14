/*
  Warnings:

  - The `date_of_visit` column on the `contact_us` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "contact_us" DROP COLUMN "date_of_visit",
ADD COLUMN     "date_of_visit" BIGINT;
