/*
  Warnings:

  - You are about to drop the column `title` on the `beneficiaries` table. All the data in the column will be lost.
  - You are about to drop the column `project_numbers1` on the `proposal` table. All the data in the column will be lost.
  - You are about to drop the `propsal_bank_information` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `id` on table `backup_client_data_latest` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `bank_information3` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `name` to the `beneficiaries` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "propsal_bank_information" DROP CONSTRAINT "propsal_bank_information_bank_information_id_fkey";

-- DropForeignKey
ALTER TABLE "propsal_bank_information" DROP CONSTRAINT "propsal_bank_information_proposal_id_fkey";

-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_employee_path_fkey";

-- AlterTable (CHANGED)
-- ALTER TABLE "backup_client_data_latest" ALTER COLUMN "id" SET NOT NULL,
-- ADD CONSTRAINT "backup_client_data_latest_pkey" PRIMARY KEY ("id");
ALTER TABLE "backup_client_data_latest" ALTER COLUMN "id" SET NOT NULL;
ALTER TABLE "backup_client_data_latest" ADD CONSTRAINT "backup_client_data_latest_pkey" PRIMARY KEY ("id");

-- AlterTable
-- ALTER TABLE "bank_information2" RENAME CONSTRAINT "bank_information2_pkey1" TO "bank_information2_pkey";

-- AlterTable (changed)
-- ALTER TABLE "bank_information3" RENAME CONSTRAINT "bank_information2_pkey" TO "bank_information3_pkey",
-- ALTER COLUMN "user_id" SET NOT NULL;
ALTER TABLE "bank_information3" RENAME CONSTRAINT "bank_information2_pkey" TO "bank_information3_pkey";
ALTER TABLE "bank_information3" ALTER COLUMN "user_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "banks" ALTER COLUMN "bank_name" SET DATA TYPE TEXT;

-- AlterTable (changed already)
-- ALTER TABLE "beneficiaries" DROP COLUMN "title",
-- ADD COLUMN     "name" VARCHAR NOT NULL;
ALTER TABLE "beneficiaries" RENAME COLUMN "title" TO "name";

-- AlterTable
ALTER TABLE "client_data4" RENAME CONSTRAINT "client_data3_pkey" TO "client_data4_pkey";

-- AlterTable (changed already)
-- ALTER TABLE "file_manager" ALTER COLUMN "table_name" DROP NOT NULL,
-- ALTER COLUMN "column_name" DROP NOT NULL,
-- ALTER COLUMN "user_id" DROP NOT NULL;
ALTER TABLE "file_manager" ALTER COLUMN "table_name" DROP NOT NULL;
ALTER TABLE "file_manager" ALTER COLUMN "column_name" DROP NOT NULL;
ALTER TABLE "file_manager" ALTER COLUMN "user_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "payment" ALTER COLUMN "status" SET DEFAULT 'SET_BY_SUPERVISOR';

-- AlterTable (changed)
-- ALTER TABLE "proposal" DROP COLUMN "project_numbers1",
-- ALTER COLUMN "project_number" DROP NOT NULL;
-- ALTER TABLE "proposal" DROP COLUMN "project_numbers1"; 
ALTER TABLE "proposal" ALTER COLUMN "project_number" DROP NOT NULL;

-- AlterTable
ALTER TABLE "proposal2" RENAME CONSTRAINT "proposal2_pkey" TO "proposal2_pkey1";

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "employee_path" SET DATA TYPE VARCHAR;

-- DropTable
DROP TABLE "propsal_bank_information";

-- CreateTable
CREATE TABLE "dept_1" (
    "id" TEXT NOT NULL,
    "proj_id" TEXT,
    "dept_1_path" TEXT,
    "dept_1_tax_1" TEXT,
    "dept_1_tax_2" TEXT,
    "dept_1_tax_3" TEXT,
    "dept_1_tax_4" TEXT,
    "dept_1_tax_uid" TEXT,
    "dept_1_tax_uid2" TEXT,
    "dept_1_op" TEXT,
    "dept_1_notes" TEXT,

    CONSTRAINT "dept_1_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dept_1001" (
    "id" TEXT NOT NULL,
    "proj_id" TEXT,
    "dept_1001_op" TEXT,
    "dept_1001_notes" TEXT,

    CONSTRAINT "dept_1001_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dept_1002" (
    "id" TEXT NOT NULL,
    "proj_id" TEXT,
    "dept_1002_op" TEXT,
    "dept_1002_notes" TEXT,

    CONSTRAINT "dept_1002_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dept_2" (
    "id" TEXT NOT NULL,
    "proj_id" TEXT,
    "dept_2_report" TEXT,
    "dept_2_notify" TEXT,
    "dept_2_agree" TEXT,
    "dept_2_op" TEXT,
    "dept_2_req" TEXT,
    "dept_2_pay_times" TEXT,
    "dept_2_notes" TEXT,
    "dept_2_tax_1" TEXT,
    "dept_2_tax_2" TEXT,
    "dept_2_tax_3" TEXT,
    "dept_2_tax_4" TEXT,
    "dept_2_reject_st" TEXT,
    "dept_2_notes1" TEXT,
    "dept_2_notes2" TEXT,
    "dept_2_notes3" TEXT,

    CONSTRAINT "dept_2_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dept_21" (
    "id" TEXT NOT NULL,
    "proj_id" TEXT,
    "dept_21_report" TEXT,
    "dept_21_notify" TEXT,
    "dept_21_agree" TEXT,
    "dept_21_op" TEXT,
    "dept_21_req" TEXT,
    "dept_21_pay_times" TEXT,
    "dept_21_notes" TEXT,
    "dept_21_tax_1" TEXT,
    "dept_21_tax_2" TEXT,
    "dept_21_tax_3" TEXT,
    "dept_21_tax_4" TEXT,
    "dept_21_reject_st" TEXT,
    "dept_21_notes1" TEXT,
    "dept_21_notes2" TEXT,
    "dept_21_notes3" TEXT,

    CONSTRAINT "dept_21_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dept_22" (
    "id" TEXT NOT NULL,
    "proj_id" TEXT,
    "dept_22_report" TEXT,
    "dept_22_notify" TEXT,
    "dept_22_agree" TEXT,
    "dept_22_op" TEXT,
    "dept_22_req" TEXT,
    "dept_22_pay_times" TEXT,
    "dept_22_notes" TEXT,
    "dept_22_tax_1" TEXT,
    "dept_22_tax_2" TEXT,
    "dept_22_tax_3" TEXT,
    "dept_22_tax_4" TEXT,
    "dept_22_reject_st" TEXT,
    "dept_22_notes1" TEXT,
    "dept_22_notes2" TEXT,
    "dept_22_notes3" TEXT,

    CONSTRAINT "dept_22_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dept_23" (
    "id" TEXT NOT NULL,
    "proj_id" TEXT,
    "dept_23_report" TEXT,
    "dept_23_notify" TEXT,
    "dept_23_agree" TEXT,
    "dept_23_op" TEXT,
    "dept_23_req" TEXT,
    "dept_23_pay_times" TEXT,
    "dept_23_notes" TEXT,
    "dept_23_tax_1" TEXT,
    "dept_23_tax_2" TEXT,
    "dept_23_tax_3" TEXT,
    "dept_23_tax_4" TEXT,
    "dept_23_reject_st" TEXT,
    "dept_23_notes1" TEXT,
    "dept_23_notes2" TEXT,
    "dept_23_notes3" TEXT,

    CONSTRAINT "dept_23_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dept_3" (
    "id" TEXT NOT NULL,
    "proj_id" TEXT,
    "dept_3_report" TEXT,
    "dept_3_notify" TEXT,
    "dept_3_agree" TEXT,
    "dept_3_op" TEXT,
    "dept_3_req" TEXT,
    "dept_3_pay_times" TEXT,
    "dept_3_notes" TEXT,
    "dept_3_notes3" TEXT,

    CONSTRAINT "dept_3_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dept_4" (
    "id" TEXT NOT NULL,
    "proj_id" TEXT,
    "dept_4_report" TEXT,
    "dept_4_notify" TEXT,
    "dept_4_agree" TEXT,
    "dept_4_op" TEXT,
    "dept_4_req" TEXT,
    "dept_4_pay_times" TEXT,
    "dept_4_notes" TEXT,
    "dept_4_notes3" TEXT,

    CONSTRAINT "dept_4_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dept_5" (
    "id" TEXT NOT NULL,
    "proj_id" TEXT,
    "dept_5_report" TEXT,
    "dept_5_notify" TEXT,
    "dept_5_agree" TEXT,
    "dept_5_op" TEXT,
    "dept_5_req" TEXT,
    "dept_5_pay_times" TEXT,
    "dept_5_notes" TEXT,

    CONSTRAINT "dept_5_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dept_6" (
    "id" TEXT NOT NULL,
    "proj_id" TEXT,
    "dept_6_report" TEXT,
    "dept_6_notify" TEXT,
    "dept_6_agree" TEXT,
    "dept_6_op" TEXT,
    "dept_6_req" TEXT,
    "dept_6_pay_times" TEXT,
    "dept_6_notes" TEXT,

    CONSTRAINT "dept_6_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dept_61" (
    "id" TEXT NOT NULL,
    "proj_id" TEXT,
    "dept_61_perm" TEXT,
    "dept_61_created" TEXT,

    CONSTRAINT "dept_61_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dept_7" (
    "id" TEXT NOT NULL,
    "proj_id" TEXT,
    "dept_7_perm" TEXT,
    "dept_7_created" TEXT,

    CONSTRAINT "dept_7_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dept_71" (
    "id" TEXT NOT NULL,
    "proj_id" TEXT,
    "dept_71_st" TEXT,
    "dept_71_pay" TEXT,

    CONSTRAINT "dept_71_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dept_72" (
    "id" TEXT NOT NULL,
    "proj_id" TEXT,
    "dept_72_st" TEXT,
    "dept_72_st_fid" TEXT,
    "pay" TEXT,

    CONSTRAINT "dept_72_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dept_75" (
    "id" TEXT NOT NULL,
    "proj_id" TEXT,
    "dept_75_notes" TEXT,

    CONSTRAINT "dept_75_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dept_8" (
    "id" TEXT NOT NULL,
    "proj_id" TEXT,
    "dept_8_perm" TEXT,
    "dept_8_created" TEXT,

    CONSTRAINT "dept_8_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dept_9" (
    "id" TEXT NOT NULL,
    "proj_id" TEXT,
    "dept_9_perm" TEXT,
    "dept_9_created" TEXT,

    CONSTRAINT "dept_9_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dept_91" (
    "id" TEXT NOT NULL,
    "proj_id" TEXT,
    "dept_91_num" TEXT,
    "dept_91_num_fid" TEXT,
    "dept_91_date" TEXT,
    "pay" TEXT,

    CONSTRAINT "dept_91_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "file_manager2" (
    "id" TEXT NOT NULL,
    "name" VARCHAR NOT NULL,
    "size" DECIMAL NOT NULL,
    "mimetype" VARCHAR NOT NULL,
    "url" VARCHAR,
    "table_name" VARCHAR,
    "column_name" VARCHAR,
    "user_id" TEXT,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT '2023-04-05 05:38:31.694309+07'::timestamp with time zone,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT '2023-04-05 05:38:31.694309+07'::timestamp with time zone,
    "proposal_id" TEXT,
    "bank_information_id" TEXT,
    "fid" TEXT,

    CONSTRAINT "file_manager2_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "file_manager3" (
    "id" TEXT NOT NULL,
    "name" VARCHAR NOT NULL,
    "size" DECIMAL NOT NULL,
    "mimetype" VARCHAR NOT NULL,
    "url" VARCHAR,
    "table_name" VARCHAR,
    "column_name" VARCHAR,
    "user_id" TEXT,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT '2023-04-05 05:38:31.694309+07'::timestamp with time zone,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT '2023-04-05 05:38:31.694309+07'::timestamp with time zone,
    "proposal_id" TEXT,
    "bank_information_id" TEXT,
    "fid" TEXT,

    CONSTRAINT "file_manager3_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "file_manager4" (
    "id" TEXT NOT NULL,
    "name" VARCHAR NOT NULL,
    "size" DECIMAL NOT NULL,
    "mimetype" VARCHAR NOT NULL,
    "url" VARCHAR,
    "table_name" VARCHAR,
    "column_name" VARCHAR,
    "user_id" TEXT,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT '2023-04-05 05:38:31.694309+07'::timestamp with time zone,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT '2023-04-05 05:38:31.694309+07'::timestamp with time zone,
    "proposal_id" TEXT,
    "bank_information_id" TEXT,
    "fid" TEXT,
    "source" TEXT,

    CONSTRAINT "file_manager4_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "file_manager5" (
    "id" TEXT NOT NULL,
    "name" VARCHAR NOT NULL,
    "size" DECIMAL NOT NULL,
    "mimetype" VARCHAR NOT NULL,
    "url" VARCHAR,
    "table_name" VARCHAR,
    "column_name" VARCHAR,
    "user_id" TEXT,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT '2023-04-05 05:38:31.694309+07'::timestamp with time zone,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT '2023-04-05 05:38:31.694309+07'::timestamp with time zone,
    "proposal_id" TEXT,
    "bank_information_id" TEXT,
    "fid" INTEGER,
    "source" TEXT,

    CONSTRAINT "file_manager5_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "file_manager6" (
    "id" TEXT NOT NULL,
    "name" VARCHAR NOT NULL,
    "size" DECIMAL NOT NULL,
    "mimetype" VARCHAR NOT NULL,
    "url" VARCHAR,
    "table_name" VARCHAR,
    "column_name" VARCHAR,
    "user_id" TEXT,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT '2023-04-05 05:38:31.694309+07'::timestamp with time zone,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT '2023-04-05 05:38:31.694309+07'::timestamp with time zone,
    "proposal_id" TEXT,
    "bank_information_id" TEXT,
    "fid" INTEGER,
    "source" TEXT,
    "path1" TEXT,
    "path2" TEXT,
    "path3" TEXT,
    "path4" TEXT,

    CONSTRAINT "file_manager6_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "files" (
    "fid" TEXT NOT NULL,
    "uid" TEXT,
    "filename" TEXT,
    "filepath" TEXT,
    "filemime" TEXT,
    "filesize" TEXT,
    "status" TEXT,
    "timestamp" TEXT,
    "length" TEXT,
    "views" TEXT,
    "downloads" TEXT,

    CONSTRAINT "files_pkey" PRIMARY KEY ("fid")
);

-- CreateTable
CREATE TABLE "proj_attach" (
    "id" TEXT NOT NULL,
    "proj_id" TEXT,
    "created" TEXT,
    "name" TEXT,
    "fid" TEXT,
    "uid" TEXT,
    "is_agree" TEXT,

    CONSTRAINT "proj_attach_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proj_money_paid" (
    "id" TEXT NOT NULL,
    "proj_id" TEXT,
    "pay" TEXT,
    "state" TEXT,
    "money" TEXT,
    "mdate" TEXT,
    "report" TEXT,
    "rdate" TEXT,
    "perm" TEXT,
    "paid" TEXT,
    "paid_acc" TEXT,
    "report_acc" TEXT,
    "date_paid" TEXT,
    "date_paid_acc" TEXT,
    "reportTxt" TEXT,

    CONSTRAINT "proj_money_paid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proj_owners" (
    "id" TEXT NOT NULL,
    "uid" TEXT,
    "proj_id" TEXT,
    "state" TEXT,
    "rate" TEXT,
    "value1" TEXT,
    "value2" TEXT,
    "value3" TEXT,

    CONSTRAINT "proj_owners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proj_req" (
    "id" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "proj_req_state" TEXT,
    "created" TEXT NOT NULL,
    "proj_req_proj" TEXT,
    "proj_req_tax_1" TEXT NOT NULL,
    "proj_req_tax_2" TEXT NOT NULL,
    "proj_req_tax_3" TEXT NOT NULL,
    "proj_req_tax_4" TEXT NOT NULL,
    "proj_req_teaser" TEXT,
    "proj_req_time" TEXT,
    "proj_req_output" TEXT,
    "proj_req_place" TEXT,
    "proj_req_date" TEXT,
    "proj_req_target" TEXT NOT NULL,
    "proj_req_target2" TEXT NOT NULL,
    "proj_req_money_req" TEXT NOT NULL,
    "proj_req_money_req_fid" TEXT NOT NULL,
    "proj_req_money_req_fid2" TEXT NOT NULL,
    "proj_req_money_req_fid3" TEXT NOT NULL,
    "proj_req_proj_manger" TEXT,
    "proj_req_proj_manger_mob" TEXT,
    "proj_req_proj_manger_mail" TEXT,
    "h_proj_req_bank" TEXT,
    "h_proj_req_bank_name" TEXT,
    "h_proj_req_bank_account_name" TEXT,
    "h_proj_req_bank_account_num" TEXT,

    CONSTRAINT "proj_req_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proj_track" (
    "id" TEXT NOT NULL,
    "proj_id" TEXT,
    "created" TEXT,
    "leaved" TEXT,
    "sec_in" TEXT,
    "sec_out" TEXT,
    "sec_uid" TEXT,
    "state" TEXT,
    "ref_id" TEXT,
    "notify" TEXT,
    "notifyM" TEXT,

    CONSTRAINT "proj_track_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proposal3" (
    "id" TEXT NOT NULL,
    "project_name" TEXT NOT NULL,
    "submitter_user_id" TEXT NOT NULL,
    "created_at" TEXT NOT NULL,
    "project_track" TEXT,
    "project_idea" TEXT,
    "project_implement_date" TEXT,
    "project_location" TEXT,
    "num_ofproject_binicficiaries" TEXT,
    "project_goals" TEXT,
    "project_outputs" TEXT,
    "project_strengths" TEXT,
    "project_risks" TEXT,
    "pm_name" TEXT,
    "pm_email" TEXT,
    "pm_mobile" TEXT,
    "governorate" TEXT,
    "region" TEXT,
    "amount_required_fsupport" TEXT,
    "need_consultant" TEXT DEFAULT 'false',
    "step" TEXT DEFAULT 'ZERO',
    "whole_budget" TEXT,
    "state" TEXT DEFAULT 'MODERATOR',
    "inner_status" TEXT DEFAULT 'CREATED_BY_CLIENT',
    "previously_add_bank" TEXT,
    "outter_status" TEXT DEFAULT 'ONGOING',
    "project_beneficiaries" TEXT,
    "number_of_payments" TEXT,
    "finance_id" TEXT,
    "cashier_id" TEXT,
    "project_manager_id" TEXT,
    "supervisor_id" TEXT,
    "project_attachments" TEXT,
    "letter_ofsupport_req" TEXT,
    "on_revision" TEXT DEFAULT 'false',
    "on_consulting" TEXT DEFAULT 'false',
    "proposal_bank_id" TEXT,
    "partial_support_amount" TEXT,
    "project_beneficiaries_specific_type" TEXT,
    "track_id" TEXT,
    "updated_at" TEXT DEFAULT 'now()',
    "clasification_field" TEXT,
    "closing_report" TEXT,
    "support_type" TEXT,
    "does_an_agreement" TEXT,
    "need_picture" TEXT,
    "support_outputs" TEXT,
    "clause" TEXT,
    "vat" TEXT,
    "vat_percentage" TEXT,
    "inclu_or_exclu" TEXT,
    "fsupport_by_supervisor" TEXT,
    "number_of_payments_by_supervisor" TEXT,
    "chairman_of_board_of_directors" TEXT,
    "been_supported_before" TEXT,
    "most_clents_projects" TEXT,
    "added_value" TEXT,
    "reasons_to_accept" TEXT,
    "target_group_num" TEXT,
    "target_group_type" TEXT,
    "target_group_age" TEXT,
    "been_made_before" TEXT,
    "remote_or_insite" TEXT,
    "old_inner_status" TEXT,
    "support_goal_id" TEXT,
    "accreditation_type_id" TEXT,
    "execution_time" TEXT,
    "project_number" SERIAL NOT NULL,
    "oid" INTEGER,

    CONSTRAINT "proposal2_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "type_reg" (
    "nid" INTEGER,
    "cont_mang_name" VARCHAR,
    "cont_mang_mob" BIGINT,
    "cont_mang_mail" VARCHAR,
    "cont_client_name" VARCHAR,
    "cont_client_mob" BIGINT,
    "cont_client_mail" VARCHAR,
    "cont_state" INTEGER,
    "cont_proj_result" INTEGER,
    "cont_notes" VARCHAR,
    "cont_employ_uid" INTEGER,
    "cont_given_uid" INTEGER,
    "cont_mang_name2" VARCHAR,
    "cont_mang_mob2" BIGINT
);

-- CreateTable
CREATE TABLE "type_reg_cont" (
    "nid" TEXT NOT NULL,
    "cont_mang_name" TEXT,
    "cont_mang_mob" TEXT,
    "cont_mang_mail" TEXT,
    "cont_client_name" TEXT,
    "cont_client_mob" TEXT,
    "cont_client_mail" TEXT,
    "cont_state" TEXT,
    "cont_proj_result" TEXT,
    "cont_notes" TEXT,
    "cont_employ_uid" TEXT,
    "cont_given_uid" TEXT,
    "cont_mang_name2" TEXT,
    "cont_mang_mob2" TEXT,

    CONSTRAINT "type_reg_cont_pkey" PRIMARY KEY ("nid")
);

-- CreateTable
CREATE TABLE "user4" (
    "id" TEXT NOT NULL,
    "employee_name" VARCHAR,
    "mobile_number" VARCHAR,
    "email" VARCHAR NOT NULL,
    "updated_at" DATE,
    "created_at" DATE,
    "employee_path" VARCHAR,
    "last_login" DATE,
    "status_id" TEXT NOT NULL,
    "address" TEXT,
    "google_session" TEXT,
    "is_online" TEXT,
    "fusionauth_id" TEXT,
    "entity" TEXT,

    CONSTRAINT "user4_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_employee_path_fkey" FOREIGN KEY ("employee_path") REFERENCES "project_tracks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "track"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "track_section" ADD CONSTRAINT "track_section_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "track"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_timeline" ADD CONSTRAINT "project_timeline_proposal_id_fkey" FOREIGN KEY ("proposal_id") REFERENCES "proposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "employees_permissions_idd_key" RENAME TO "employees_permissions_id_key";
