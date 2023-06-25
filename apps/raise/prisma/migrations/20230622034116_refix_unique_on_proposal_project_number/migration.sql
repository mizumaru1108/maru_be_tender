-- RenameIndex
-- ALTER INDEX "idx_project_number" RENAME TO "proposal_project_number_key";
DROP INDEX "idx_project_number";

ALTER TABLE "proposal" ADD CONSTRAINT "proposal_project_number_key" UNIQUE("project_number");
