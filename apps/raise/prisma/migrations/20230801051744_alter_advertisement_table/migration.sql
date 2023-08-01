-- AlterTable
ALTER TABLE "banners" RENAME CONSTRAINT "advertisements_pkey" TO "banners_pkey";

-- RenameForeignKey
ALTER TABLE "banners" RENAME CONSTRAINT "advertisements_track_id_fkey" TO "banners_track_id_fkey";
