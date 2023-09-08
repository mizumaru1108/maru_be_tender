-- AlterTable
ALTER TABLE "user" ALTER COLUMN "is_deleted" DROP NOT NULL,
ALTER COLUMN "is_deleted" DROP DEFAULT;
