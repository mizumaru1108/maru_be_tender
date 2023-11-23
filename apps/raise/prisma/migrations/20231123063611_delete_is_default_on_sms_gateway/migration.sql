/*
  Warnings:

  - You are about to drop the column `is_default` on the `sms_gateways` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "sms_gateways" DROP COLUMN "is_default";
