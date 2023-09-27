-- AlterTable
ALTER TABLE "proposal_governorate" ADD COLUMN     "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "proposal_region" ADD COLUMN     "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP;
