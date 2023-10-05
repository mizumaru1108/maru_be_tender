/*
  Warnings:

  - Made the column `created_at` on table `email_record` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `email_record` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "email_record" ADD COLUMN     "attachments" JSONB,
ADD COLUMN     "receiver_email" TEXT,
ADD COLUMN     "receiver_name" TEXT,
ADD COLUMN     "user_on_app" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "receiver_id" DROP NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;
