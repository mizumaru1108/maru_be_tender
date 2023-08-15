/*
  Warnings:

  - You are about to drop the column `reason_visit` on the `contact_us` table. All the data in the column will be lost.
  - The `date_of_visit` column on the `contact_us` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "contact_us" DROP COLUMN "reason_visit",
ADD COLUMN     "visit_reason" TEXT,
DROP COLUMN "date_of_visit",
ADD COLUMN     "date_of_visit" TIMESTAMP(3);
