/*
  Warnings:

  - Made the column `is_deleted` on table `track_section` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "track_section" ALTER COLUMN "is_deleted" SET NOT NULL;
