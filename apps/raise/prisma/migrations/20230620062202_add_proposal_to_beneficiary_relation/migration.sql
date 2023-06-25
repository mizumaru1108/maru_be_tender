-- AlterTable
ALTER TABLE "proposal" ADD COLUMN     "beneficiary_id" TEXT;

-- AddForeignKey
ALTER TABLE "proposal" ADD CONSTRAINT "proposal_beneficiary_id_fkey" FOREIGN KEY ("beneficiary_id") REFERENCES "beneficiaries"("id") ON DELETE SET NULL ON UPDATE CASCADE;
