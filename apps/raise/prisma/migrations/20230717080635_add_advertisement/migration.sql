-- CreateTable
CREATE TABLE "advertisements" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "track_id" TEXT,
    "logo" JSONB,
    "date" DATE NOT NULL,
    "start_time" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "advertisements_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "advertisements" ADD CONSTRAINT "advertisements_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "track"("id") ON DELETE SET NULL ON UPDATE CASCADE;
