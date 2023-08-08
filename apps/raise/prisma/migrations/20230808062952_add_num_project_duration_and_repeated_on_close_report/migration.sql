-- AlterTable
ALTER TABLE "proposal_closing_report" ADD COLUMN     "number_project_duration" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "number_project_repeated" INTEGER NOT NULL DEFAULT 0;
