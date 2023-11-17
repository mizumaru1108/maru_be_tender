-- CreateTable
CREATE TABLE "section_supervisors" (
    "section_supervisor_id" TEXT NOT NULL,
    "section_id" TEXT NOT NULL,
    "supervisor_user_id" TEXT NOT NULL,

    CONSTRAINT "section_supervisors_pkey" PRIMARY KEY ("section_supervisor_id")
);

-- AddForeignKey
ALTER TABLE "section_supervisors" ADD CONSTRAINT "section_supervisors_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "track_section"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "section_supervisors" ADD CONSTRAINT "section_supervisors_supervisor_user_id_fkey" FOREIGN KEY ("supervisor_user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
