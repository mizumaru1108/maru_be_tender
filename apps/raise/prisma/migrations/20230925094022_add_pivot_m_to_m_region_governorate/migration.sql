-- CreateTable
CREATE TABLE "proposal_region" (
    "proposal_region_id" TEXT NOT NULL,
    "proposal_id" TEXT NOT NULL,
    "region_id" TEXT NOT NULL,

    CONSTRAINT "proposal_region_pkey" PRIMARY KEY ("proposal_region_id")
);

-- CreateTable
CREATE TABLE "proposal_governorate" (
    "proposal_governorate_id" TEXT NOT NULL,
    "proposal_id" TEXT NOT NULL,
    "governorate_id" TEXT NOT NULL,

    CONSTRAINT "proposal_governorate_pkey" PRIMARY KEY ("proposal_governorate_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "proposal_region_proposal_region_id_key" ON "proposal_region"("proposal_region_id");

-- CreateIndex
CREATE UNIQUE INDEX "proposal_governorate_proposal_governorate_id_key" ON "proposal_governorate"("proposal_governorate_id");

-- AddForeignKey
ALTER TABLE "proposal_region" ADD CONSTRAINT "proposal_region_proposal_id_fkey" FOREIGN KEY ("proposal_id") REFERENCES "proposal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposal_region" ADD CONSTRAINT "proposal_region_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "regions"("region_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposal_governorate" ADD CONSTRAINT "proposal_governorate_proposal_id_fkey" FOREIGN KEY ("proposal_id") REFERENCES "proposal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposal_governorate" ADD CONSTRAINT "proposal_governorate_governorate_id_fkey" FOREIGN KEY ("governorate_id") REFERENCES "governorates"("governorate_id") ON DELETE RESTRICT ON UPDATE CASCADE;
