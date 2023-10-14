-- AlterTable
ALTER TABLE "proposal" ADD COLUMN     "section_id" TEXT;

-- AddForeignKey
ALTER TABLE "proposal" ADD CONSTRAINT "proposal_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "track_section"("id") ON DELETE SET NULL ON UPDATE CASCADE;
