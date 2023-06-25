-- AlterTable
ALTER TABLE "proposal_log" ADD COLUMN     "new_values" JSONB,
ADD COLUMN     "old_values" JSONB;
