/*
  Warnings:

  - The primary key for the `contact_us` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `contact_us` table. All the data in the column will be lost.
  - Added the required column `contact_us_id` to the `contact_us` table without a default value. This is not possible if the table is not empty.
  - Added the required column `submitter_user_id` to the `contact_us` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "contact_us" DROP CONSTRAINT "contact_us_pkey",
DROP COLUMN "id",
ADD COLUMN     "contact_us_id" TEXT NOT NULL,
ADD COLUMN     "proposal_id" TEXT,
ADD COLUMN     "submitter_user_id" TEXT NOT NULL,
ADD CONSTRAINT "contact_us_pkey" PRIMARY KEY ("contact_us_id");

-- AddForeignKey
ALTER TABLE "contact_us" ADD CONSTRAINT "contact_us_submitter_user_id_fkey" FOREIGN KEY ("submitter_user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_us" ADD CONSTRAINT "contact_us_proposal_id_fkey" FOREIGN KEY ("proposal_id") REFERENCES "proposal"("id") ON DELETE SET NULL ON UPDATE CASCADE;
