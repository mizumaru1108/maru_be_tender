-- DropForeignKey
ALTER TABLE "proposal_governorate" DROP CONSTRAINT "proposal_governorate_proposal_id_fkey";

-- DropForeignKey
ALTER TABLE "proposal_region" DROP CONSTRAINT "proposal_region_proposal_id_fkey";

-- AddForeignKey
ALTER TABLE "proposal_region" ADD CONSTRAINT "proposal_region_proposal_id_fkey" FOREIGN KEY ("proposal_id") REFERENCES "proposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposal_governorate" ADD CONSTRAINT "proposal_governorate_proposal_id_fkey" FOREIGN KEY ("proposal_id") REFERENCES "proposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
