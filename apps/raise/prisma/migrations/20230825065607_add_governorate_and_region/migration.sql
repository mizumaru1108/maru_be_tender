-- CreateTable
CREATE TABLE "regions" (
    "region_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "regions_pkey" PRIMARY KEY ("region_id")
);

-- CreateTable
CREATE TABLE "governorates" (
    "governorate_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "region_id" TEXT NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "governorates_pkey" PRIMARY KEY ("governorate_id")
);

-- AddForeignKey
ALTER TABLE "governorates" ADD CONSTRAINT "governorates_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "regions"("region_id") ON DELETE RESTRICT ON UPDATE CASCADE;
