-- CreateTable
CREATE TABLE "closing_report_beneficiaries" (
    "id" TEXT NOT NULL,
    "closing_report_id" TEXT NOT NULL,
    "selected_values" TEXT NOT NULL,
    "selected_numbers" INTEGER NOT NULL,

    CONSTRAINT "closing_report_beneficiaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "closing_report_execution_places" (
    "id" TEXT NOT NULL,
    "closing_report_id" TEXT NOT NULL,
    "selected_values" TEXT NOT NULL,
    "selected_numbers" INTEGER NOT NULL,

    CONSTRAINT "closing_report_execution_places_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "closing_report_genders" (
    "id" TEXT NOT NULL,
    "closing_report_id" TEXT NOT NULL,
    "selected_values" TEXT NOT NULL,
    "selected_numbers" INTEGER NOT NULL,

    CONSTRAINT "closing_report_genders_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "closing_report_beneficiaries" ADD CONSTRAINT "closing_report_beneficiaries_closing_report_id_fkey" FOREIGN KEY ("closing_report_id") REFERENCES "proposal_closing_report"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "closing_report_execution_places" ADD CONSTRAINT "closing_report_execution_places_closing_report_id_fkey" FOREIGN KEY ("closing_report_id") REFERENCES "proposal_closing_report"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "closing_report_genders" ADD CONSTRAINT "closing_report_genders_closing_report_id_fkey" FOREIGN KEY ("closing_report_id") REFERENCES "proposal_closing_report"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
