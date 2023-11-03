-- CreateTable
CREATE TABLE "proposal_configs" (
    "proposal_config_id" TEXT NOT NULL,
    "applying_status" BOOLEAN NOT NULL DEFAULT false,
    "indicator_of_project_duration_days" INTEGER NOT NULL,
    "number_of_days_to_meet_business" INTEGER NOT NULL,
    "hieght_project_budget" INTEGER NOT NULL,
    "number_of_allowing_projects" INTEGER NOT NULL,
    "ending_date" TIMESTAMP(3) NOT NULL,
    "starting_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "proposal_configs_pkey" PRIMARY KEY ("proposal_config_id")
);
