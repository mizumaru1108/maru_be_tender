/*
  Warnings:

  - The primary key for the `email_record` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "email_record" DROP CONSTRAINT "email_history_pkey",
ALTER COLUMN "email_record_id" DROP DEFAULT,
ALTER COLUMN "email_record_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "email_history_pkey" PRIMARY KEY ("email_record_id");
