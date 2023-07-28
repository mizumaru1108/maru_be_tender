-- AlterTable
ALTER TABLE "proposal_closing_report" ALTER COLUMN "target_beneficiaries" DROP NOT NULL,
ALTER COLUMN "execution_place" DROP NOT NULL,
ALTER COLUMN "gender" DROP NOT NULL;
