/*
  Warnings:

  - Made the column `created_at` on table `proposal_governorate` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `proposal_region` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "proposal_governorate" ALTER COLUMN "created_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "proposal_region" ALTER COLUMN "created_at" SET NOT NULL;
