/*
  Warnings:

  - The primary key for the `email_record` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `email_record` table. All the data in the column will be lost.
  - Added the required column `email_record_id` to the `email_record` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "email_record" RENAME COLUMN "id" TO "email_record_id";
