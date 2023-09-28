/*
  Warnings:

  - You are about to drop the column `section_id` on the `track_section` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "track_section" DROP CONSTRAINT "track_section_section_id_fkey";

-- AlterTable
ALTER TABLE "track_section" DROP COLUMN "section_id",
ADD COLUMN     "parent_section_id" TEXT;

-- AddForeignKey
ALTER TABLE "track_section" ADD CONSTRAINT "track_section_parent_section_id_fkey" FOREIGN KEY ("parent_section_id") REFERENCES "track_section"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;
