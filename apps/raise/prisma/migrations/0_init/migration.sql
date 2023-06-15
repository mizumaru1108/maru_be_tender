-- CreateTable
CREATE TABLE "bank_information" (
    "user_id" TEXT NOT NULL,
    "bank_account_name" VARCHAR,
    "bank_account_number" VARCHAR,
    "bank_name" VARCHAR,
    "proposal_id" TEXT,
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "card_image" JSONB,
    "is_deleted" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "bank_id" VARCHAR,

    CONSTRAINT "bank_information_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_data" (
    "id" TEXT NOT NULL,
    "entity" VARCHAR,
    "authority" VARCHAR,
    "headquarters" VARCHAR,
    "date_of_esthablistmen" DATE,
    "num_of_beneficiaries" INTEGER,
    "num_of_employed_facility" INTEGER,
    "governorate" TEXT,
    "region" VARCHAR,
    "entity_mobile" VARCHAR,
    "center_administration" VARCHAR,
    "twitter_acount" VARCHAR,
    "phone" VARCHAR,
    "website" VARCHAR,
    "password" VARCHAR,
    "license_number" VARCHAR,
    "license_expired" DATE,
    "license_issue_date" DATE,
    "ceo_mobile" VARCHAR,
    "ceo_name" VARCHAR,
    "data_entry_mobile" VARCHAR,
    "data_entry_name" VARCHAR,
    "data_entry_mail" VARCHAR,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "client_field" VARCHAR,
    "user_id" TEXT NOT NULL,
    "license_file" JSONB,
    "board_ofdec_file" JSONB,
    "chairman_name" VARCHAR,
    "chairman_mobile" VARCHAR,
    "qid" INTEGER,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees_permissions" (
    "organization_id" TEXT,
    "user_id" TEXT NOT NULL,
    "director_of_baptisms_department" BOOLEAN DEFAULT false,
    "director_of_initiatives_department" BOOLEAN DEFAULT false,
    "director_of_mosque_administration" BOOLEAN DEFAULT false,
    "director_of_charity_department" BOOLEAN DEFAULT false,
    "president" BOOLEAN DEFAULT false,
    "reports" BOOLEAN DEFAULT false,
    "sorting_officer" BOOLEAN DEFAULT false,
    "relationship_officer" BOOLEAN DEFAULT false,
    "treasurer" BOOLEAN DEFAULT false,
    "acountant" BOOLEAN DEFAULT false,
    "edit_drop_down_menus" BOOLEAN DEFAULT false,
    "entering_the_anual_plan" BOOLEAN DEFAULT false,
    "user_and_permision" BOOLEAN DEFAULT false,
    "correspondence" BOOLEAN DEFAULT false,
    "advisors_committee" BOOLEAN DEFAULT false,
    "project_supervisor" BOOLEAN DEFAULT false,
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),

    CONSTRAINT "employees_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inquiry_type" (
    "id" TEXT NOT NULL,

    CONSTRAINT "inquiry_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message" (
    "id" TEXT NOT NULL,
    "room_id" TEXT,
    "owner_id" TEXT,
    "read_status" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "content_type_id" TEXT NOT NULL,
    "content_title" VARCHAR,
    "attachment" JSONB,
    "reply_id" TEXT,
    "content" TEXT,
    "receiver_id" TEXT,
    "sender_role_as" TEXT,
    "receiver_role_as" TEXT,

    CONSTRAINT "message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization" (
    "id" TEXT NOT NULL,
    "organization" CHAR(1) NOT NULL,

    CONSTRAINT "organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment" (
    "id" TEXT NOT NULL,
    "payment_amount" DECIMAL,
    "proposal_id" TEXT NOT NULL,
    "payment_date" DATE,
    "status" TEXT DEFAULT 'set_by_supervisor',
    "number_of_payments" DECIMAL,
    "order" DECIMAL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proposal" (
    "id" TEXT NOT NULL,
    "project_name" VARCHAR NOT NULL,
    "submitter_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "project_track" TEXT,
    "project_idea" TEXT,
    "project_implement_date" DATE,
    "project_location" TEXT,
    "num_ofproject_binicficiaries" INTEGER,
    "project_goals" TEXT,
    "project_outputs" TEXT,
    "project_strengths" TEXT,
    "project_risks" TEXT,
    "pm_name" VARCHAR,
    "pm_email" VARCHAR,
    "pm_mobile" VARCHAR,
    "governorate" TEXT,
    "region" VARCHAR,
    "amount_required_fsupport" DECIMAL,
    "need_consultant" BOOLEAN DEFAULT false,
    "step" TEXT DEFAULT 'ZERO',
    "whole_budget" DECIMAL,
    "state" TEXT DEFAULT 'MODERATOR',
    "inner_status" TEXT DEFAULT 'CREATED_BY_CLIENT',
    "previously_add_bank" TEXT[],
    "outter_status" TEXT DEFAULT 'ONGOING',
    "project_beneficiaries" VARCHAR,
    "number_of_payments" DECIMAL,
    "finance_id" TEXT,
    "cashier_id" TEXT,
    "project_manager_id" TEXT,
    "supervisor_id" TEXT,
    "project_attachments" JSONB,
    "letter_ofsupport_req" JSONB,
    "on_revision" BOOLEAN DEFAULT false,
    "on_consulting" BOOLEAN DEFAULT false,
    "proposal_bank_id" UUID,
    "partial_support_amount" DECIMAL,
    "project_beneficiaries_specific_type" TEXT,
    "track_id" VARCHAR,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "clasification_field" VARCHAR,
    "closing_report" BOOLEAN,
    "support_type" BOOLEAN,
    "does_an_agreement" BOOLEAN,
    "need_picture" BOOLEAN,
    "support_outputs" TEXT,
    "clause" TEXT,
    "vat" BOOLEAN,
    "vat_percentage" INTEGER,
    "inclu_or_exclu" BOOLEAN,
    "fsupport_by_supervisor" DECIMAL,
    "number_of_payments_by_supervisor" DECIMAL,
    "chairman_of_board_of_directors" TEXT,
    "been_supported_before" BOOLEAN,
    "most_clents_projects" TEXT,
    "added_value" TEXT,
    "reasons_to_accept" TEXT,
    "target_group_num" INTEGER,
    "target_group_type" TEXT,
    "target_group_age" TEXT,
    "been_made_before" BOOLEAN,
    "remote_or_insite" VARCHAR,
    "old_inner_status" VARCHAR,
    "support_goal_id" TEXT,
    "accreditation_type_id" TEXT,
    "execution_time" DECIMAL,
    "project_numbers1" SERIAL NOT NULL,
    "oid" INTEGER,
    "project_number" SERIAL,

    CONSTRAINT "proposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proposal_comment" (
    "id" TEXT NOT NULL,
    "proposal_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "comment" TEXT,
    "user_id" TEXT,

    CONSTRAINT "proposal_comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proposal_item_budget" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL NOT NULL,
    "explanation" TEXT NOT NULL,
    "clause" CHAR(255) NOT NULL,
    "proposal_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "detail_project_budget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proposal_log" (
    "id" TEXT NOT NULL,
    "proposal_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewer_id" TEXT,
    "state" TEXT NOT NULL,
    "notes" TEXT,
    "action" VARCHAR,
    "message" VARCHAR,
    "user_role" VARCHAR,
    "response_time" INTEGER,
    "reject_reason" VARCHAR,

    CONSTRAINT "proposal_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proposal_state" (
    "id" TEXT NOT NULL,

    CONSTRAINT "proposal_state_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "region" (
    "id" TEXT NOT NULL,
    "region" CHAR(255) NOT NULL,

    CONSTRAINT "region_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "employee_name" VARCHAR,
    "mobile_number" VARCHAR,
    "email" VARCHAR NOT NULL,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "employee_path" TEXT,
    "last_login" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "status_id" TEXT NOT NULL,
    "address" TEXT,
    "google_session" JSONB,
    "is_online" BOOLEAN,
    "uid" INTEGER,
    "track_id" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_type" (
    "id" TEXT NOT NULL,

    CONSTRAINT "user_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proposal_assign" (
    "id" SERIAL NOT NULL,
    "proposal_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "assign" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "proposal_assign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proposal_follow_up" (
    "id" TEXT NOT NULL,
    "proposal_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "attachments" JSONB,
    "content" TEXT,
    "user_id" TEXT NOT NULL,
    "submitter_role" TEXT NOT NULL,
    "employee_only" BOOLEAN NOT NULL,

    CONSTRAINT "proposal_follow_up_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proposal_status" (
    "id" TEXT NOT NULL,

    CONSTRAINT "proposal_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_log" (
    "id" TEXT NOT NULL,
    "reviewer_id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "note_account_information" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,

    CONSTRAINT "client_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proposal_request" (
    "id" TEXT NOT NULL,

    CONSTRAINT "proposal_request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supervisor" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "proposal_id" TEXT NOT NULL,
    "clasification_field" VARCHAR NOT NULL,
    "closing_report" BOOLEAN NOT NULL,
    "support_type" BOOLEAN NOT NULL,
    "does_an_agreement" BOOLEAN NOT NULL,
    "need_picture" BOOLEAN NOT NULL,
    "number_of_payments" DECIMAL NOT NULL,
    "support_amount" DECIMAL NOT NULL,
    "notes" TEXT,
    "support_outputs" TEXT,
    "clause" TEXT,
    "vat" BOOLEAN,
    "vat_percentage" INTEGER,
    "inclu_or_exclu" BOOLEAN,
    "support_goals" TEXT,

    CONSTRAINT "supervisor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proposal_beneficiaries" (
    "id" TEXT NOT NULL,

    CONSTRAINT "proposal_beneficiaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proposal_step" (
    "id" TEXT NOT NULL,

    CONSTRAINT "proposal_step_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cheque" (
    "id" TEXT NOT NULL,
    "payment_id" TEXT NOT NULL,
    "deposit_date" DATE NOT NULL,
    "number" VARCHAR NOT NULL,
    "transfer_receipt" JSONB NOT NULL,

    CONSTRAINT "cheque_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_status" (
    "id" TEXT NOT NULL,

    CONSTRAINT "payment_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "correspondance_category" (
    "id" TEXT NOT NULL,

    CONSTRAINT "correspondance_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "edit_request_status" (
    "id" TEXT NOT NULL,

    CONSTRAINT "edit_request_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_tracks" (
    "id" TEXT NOT NULL,

    CONSTRAINT "project_kind_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_chat" (
    "id" TEXT NOT NULL,
    "correspondance_category_id" TEXT NOT NULL,
    "participant1_user_id" TEXT,
    "participant2_user_id" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "room_chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_us" (
    "id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "receiver_id" TEXT NOT NULL,
    "inquiry_type" VARCHAR,
    "title" VARCHAR,
    "project_name" VARCHAR,
    "message" TEXT,
    "date_of_visit" DATE,
    "reason_visit" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contcatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointment" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "employee_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "meeting_url" VARCHAR NOT NULL,
    "calendar_url" VARCHAR NOT NULL,
    "date" DATE NOT NULL,
    "start_time" VARCHAR NOT NULL,
    "end_time" VARCHAR NOT NULL,
    "reject_reason" TEXT,
    "status" VARCHAR NOT NULL,
    "day" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "calendar_event_id" VARCHAR NOT NULL,

    CONSTRAINT "appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedule" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "day" VARCHAR NOT NULL,
    "start_time" VARCHAR,
    "end_time" VARCHAR,

    CONSTRAINT "schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_record" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" VARCHAR NOT NULL,
    "content" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "receiver_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "authority" (
    "id" TEXT NOT NULL,
    "title" VARCHAR NOT NULL,

    CONSTRAINT "authority_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banks" (
    "id" TEXT NOT NULL,
    "bank_name" VARCHAR,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "is_deleted" BOOLEAN DEFAULT false,

    CONSTRAINT "banks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "beneficiaries" (
    "id" TEXT NOT NULL,
    "title" VARCHAR NOT NULL,
    "is_deleted" BOOLEAN DEFAULT false,

    CONSTRAINT "beneficiaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recommended_support_consultant" (
    "clause" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "id" TEXT NOT NULL,
    "proposal_id" TEXT NOT NULL,

    CONSTRAINT "recommended_support_consultant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "track" (
    "name" TEXT,
    "id" VARCHAR NOT NULL,
    "with_consultation" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "is_deleted" BOOLEAN DEFAULT false,

    CONSTRAINT "track_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "track_section" (
    "id" TEXT NOT NULL,
    "name" VARCHAR NOT NULL,
    "budget" REAL NOT NULL,
    "section_id" TEXT,
    "is_leaf" BOOLEAN DEFAULT false,
    "track_id" TEXT NOT NULL,
    "is_deleted" BOOLEAN DEFAULT false,

    CONSTRAINT "track_section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_status" (
    "id" TEXT NOT NULL,

    CONSTRAINT "client_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_role" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "user_type_id" TEXT NOT NULL,

    CONSTRAINT "user_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_type" (
    "id" TEXT NOT NULL,

    CONSTRAINT "content_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accreditation_type" (
    "id" TEXT NOT NULL,

    CONSTRAINT "accreditation_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_timeline" (
    "id" TEXT NOT NULL,
    "name" VARCHAR NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "proposal_id" TEXT NOT NULL,

    CONSTRAINT "project_timeline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "support_goal" (
    "id" TEXT NOT NULL,

    CONSTRAINT "support_goal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification" (
    "id" TEXT NOT NULL,
    "content" VARCHAR NOT NULL,
    "proposal_id" TEXT,
    "message_id" TEXT,
    "appointment_id" TEXT,
    "user_id" TEXT NOT NULL,
    "type" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "read_status" BOOLEAN DEFAULT false,
    "subject" TEXT NOT NULL,
    "proposal_log_id" TEXT,
    "shown" BOOLEAN NOT NULL DEFAULT true,
    "specific_type" VARCHAR,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_status_log" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "account_manager_id" TEXT,
    "status_id" TEXT NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_status_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "edit_requests" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "reviewer_id" TEXT,
    "status_id" TEXT NOT NULL,
    "reject_reason" TEXT,
    "rejected_at" TIMESTAMPTZ(6),
    "accepted_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "new_value" VARCHAR NOT NULL,
    "old_value" VARCHAR NOT NULL,

    CONSTRAINT "edit_request_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "file_manager" (
    "id" TEXT NOT NULL,
    "name" VARCHAR NOT NULL,
    "size" DECIMAL NOT NULL,
    "mimetype" VARCHAR NOT NULL,
    "url" VARCHAR NOT NULL,
    "table_name" VARCHAR NOT NULL,
    "column_name" VARCHAR NOT NULL,
    "user_id" TEXT NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "proposal_id" TEXT,
    "bank_information_id" TEXT,
    "fid" INTEGER,

    CONSTRAINT "file_manager_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bank_information2" (
    "user_id" TEXT,
    "bank_account_name" VARCHAR,
    "bank_account_number" VARCHAR,
    "bank_name" VARCHAR,
    "proposal_id" TEXT,
    "id" TEXT NOT NULL DEFAULT '',
    "card_image" TEXT,
    "is_deleted" BOOLEAN DEFAULT false,

    CONSTRAINT "bank_information2_pkey1" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_data2" (
    "id" TEXT NOT NULL,
    "entity" VARCHAR,
    "authority" VARCHAR,
    "headquarters" VARCHAR,
    "date_of_esthablistmen" DATE,
    "num_of_beneficiaries" INTEGER,
    "num_of_employed_facility" INTEGER,
    "governorate" TEXT,
    "region" VARCHAR,
    "entity_mobile" VARCHAR,
    "center_administration" VARCHAR,
    "twitter_acount" VARCHAR,
    "phone" VARCHAR,
    "website" VARCHAR,
    "password" VARCHAR,
    "license_number" VARCHAR,
    "license_expired" DATE,
    "license_issue_date" TEXT,
    "ceo_mobile" VARCHAR,
    "ceo_name" VARCHAR,
    "data_entry_mobile" VARCHAR,
    "data_entry_name" VARCHAR,
    "data_entry_mail" VARCHAR,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "client_field" VARCHAR,
    "user_id" TEXT NOT NULL,
    "license_file" TEXT,
    "board_ofdec_file" TEXT,
    "chairman_name" VARCHAR,
    "chairman_mobile" VARCHAR,
    "qid" INTEGER,

    CONSTRAINT "client_data2_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proposal_edit_request" (
    "id" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "reviewer_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "proposal_id" TEXT NOT NULL,

    CONSTRAINT "proposal_edit_request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proposal_asked_edit_request" (
    "id" TEXT NOT NULL,
    "notes" VARCHAR NOT NULL,
    "sender_id" TEXT NOT NULL,
    "sender_role" VARCHAR NOT NULL,
    "proposal_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "supervisor_id" TEXT,

    CONSTRAINT "proposal_asked_edit_request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proposal_closing_report" (
    "id" TEXT NOT NULL,
    "proposal_id" TEXT NOT NULL,
    "number_of_beneficiaries" INTEGER NOT NULL,
    "target_beneficiaries" VARCHAR NOT NULL,
    "execution_place" VARCHAR NOT NULL,
    "gender" VARCHAR NOT NULL,
    "project_duration" VARCHAR NOT NULL,
    "project_repeated" VARCHAR NOT NULL,
    "number_of_volunteer" INTEGER NOT NULL,
    "number_of_staff" INTEGER NOT NULL,
    "attachments" JSONB NOT NULL,
    "images" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "closing_report_request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user3" (
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
    "uid" INTEGER,

    CONSTRAINT "user3_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_trf" (
    "uid" INTEGER,
    "name" VARCHAR(50),
    "pass" VARCHAR(50),
    "mail" VARCHAR(50),
    "mode" INTEGER,
    "sort" INTEGER,
    "threshold" INTEGER,
    "theme" VARCHAR(50),
    "signature" VARCHAR(50),
    "signature_format" INTEGER,
    "created" BIGINT,
    "access" BIGINT,
    "login" BIGINT,
    "status" INTEGER,
    "timezone" VARCHAR(50),
    "language" VARCHAR(50),
    "picture" VARCHAR(50),
    "init" VARCHAR(50),
    "data" VARCHAR(128),
    "kind" INTEGER,
    "mob" BIGINT,
    "fid" INTEGER,
    "tmra_id" VARCHAR(50),
    "fusionauth_id" TEXT
);

-- CreateTable
CREATE TABLE "tmp_client_proper" (
    "uid" INTEGER NOT NULL,
    "name" VARCHAR(60),
    "pass" VARCHAR(32),
    "mail" VARCHAR(64),
    "mode" INTEGER NOT NULL,
    "sort" INTEGER,
    "threshold" INTEGER,
    "theme" VARCHAR(255),
    "signature" VARCHAR(255),
    "signature_format" SMALLINT NOT NULL,
    "created" INTEGER NOT NULL,
    "access" INTEGER NOT NULL,
    "login" INTEGER NOT NULL,
    "status" INTEGER NOT NULL,
    "timezone" VARCHAR(8),
    "language" VARCHAR(12),
    "picture" VARCHAR(255),
    "init" VARCHAR(64),
    "data" TEXT,
    "kind" INTEGER NOT NULL,
    "mob" BIGINT NOT NULL,
    "fid" INTEGER NOT NULL,
    "qid" INTEGER,
    "nid" INTEGER,
    "random" VARCHAR(255),
    "reg_name" VARCHAR(255),
    "reg_tax_1" INTEGER,
    "reg_tax_2" INTEGER,
    "reg_tel" BIGINT,
    "reg_fax" BIGINT,
    "reg_box" INTEGER,
    "reg_postal" INTEGER,
    "reg_site" VARCHAR(255),
    "reg_email" VARCHAR(255),
    "reg_bank_name" INTEGER,
    "reg_bank_account_name" VARCHAR(255),
    "reg_bank_account_num" VARCHAR(255),
    "reg_bank_account_type" INTEGER,
    "reg_area" INTEGER,
    "reg_city" INTEGER,
    "reg_center" INTEGER,
    "reg_center2" VARCHAR(255),
    "reg_twit" TEXT,
    "reg_face" TEXT,
    "reg_mob" BIGINT,
    "cont_mang_name" VARCHAR(255),
    "tmra_id" VARCHAR(60)
);

-- CreateTable
CREATE TABLE "client_data4" (
    "id" TEXT NOT NULL,
    "entity" VARCHAR,
    "authority" VARCHAR,
    "headquarters" VARCHAR,
    "date_of_esthablistmen" DATE,
    "num_of_beneficiaries" INTEGER,
    "num_of_employed_facility" INTEGER,
    "governorate" TEXT,
    "region" VARCHAR,
    "entity_mobile" VARCHAR,
    "center_administration" VARCHAR,
    "twitter_acount" VARCHAR,
    "phone" VARCHAR,
    "website" VARCHAR,
    "password" VARCHAR,
    "license_number" VARCHAR,
    "license_expired" DATE,
    "license_issue_date" TEXT,
    "ceo_mobile" VARCHAR,
    "ceo_name" VARCHAR,
    "data_entry_mobile" VARCHAR,
    "data_entry_name" VARCHAR,
    "data_entry_mail" VARCHAR,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "client_field" VARCHAR,
    "user_id" TEXT NOT NULL,
    "license_file" TEXT,
    "board_ofdec_file" TEXT,
    "chairman_name" VARCHAR,
    "chairman_mobile" VARCHAR,
    "qid" INTEGER,

    CONSTRAINT "client_data3_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bank_information3" (
    "user_id" TEXT,
    "bank_account_name" VARCHAR,
    "bank_account_number" VARCHAR,
    "bank_name" VARCHAR,
    "proposal_id" TEXT,
    "id" TEXT NOT NULL DEFAULT '',
    "card_image" TEXT,
    "is_deleted" BOOLEAN DEFAULT false,

    CONSTRAINT "bank_information2_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proposal2" (
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
    "project_number" INTEGER,
    "oid" INTEGER,

    CONSTRAINT "proposal2_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_role2" (
    "id" UUID NOT NULL,
    "user_id" TEXT NOT NULL,
    "user_type_id" TEXT NOT NULL,

    CONSTRAINT "user_role2_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "backup_client_data_latest" (
    "id" TEXT,
    "entity" VARCHAR,
    "authority" VARCHAR,
    "headquarters" VARCHAR,
    "date_of_esthablistmen" DATE,
    "num_of_beneficiaries" INTEGER,
    "num_of_employed_facility" INTEGER,
    "governorate" TEXT,
    "region" VARCHAR,
    "entity_mobile" VARCHAR,
    "center_administration" VARCHAR,
    "twitter_acount" VARCHAR,
    "phone" VARCHAR,
    "website" VARCHAR,
    "password" VARCHAR,
    "license_number" VARCHAR,
    "license_expired" DATE,
    "license_issue_date" DATE,
    "ceo_mobile" VARCHAR,
    "ceo_name" VARCHAR,
    "data_entry_mobile" VARCHAR,
    "data_entry_name" VARCHAR,
    "data_entry_mail" VARCHAR,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "client_field" VARCHAR,
    "user_id" TEXT,
    "license_file" JSONB,
    "board_ofdec_file" JSONB,
    "chairman_name" VARCHAR,
    "chairman_mobile" VARCHAR,
    "qid" INTEGER
);

-- CreateTable
CREATE TABLE "propsal_bank_information" (
    "id" TEXT NOT NULL,
    "bank_information_id" UUID NOT NULL,
    "proposal_id" TEXT NOT NULL,

    CONSTRAINT "propsal_bank_information_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bank_information_id_key" ON "bank_information"("id");

-- CreateIndex
CREATE UNIQUE INDEX "client_data_user_id_key" ON "client_data"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "employees_permissions_idd_key" ON "employees_permissions"("id");

-- CreateIndex
CREATE UNIQUE INDEX "idx_project_number" ON "proposal"("project_number");

-- CreateIndex
CREATE UNIQUE INDEX "proposal_comment_id_key" ON "proposal_comment"("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_id_key" ON "user"("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "project_kind_id_key" ON "project_tracks"("id");

-- CreateIndex
CREATE UNIQUE INDEX "track_name_key" ON "track"("name");

-- CreateIndex
CREATE UNIQUE INDEX "file_manager_url_key" ON "file_manager"("url");

-- CreateIndex
CREATE UNIQUE INDEX "proposal_edit_request_proposal_id_key" ON "proposal_edit_request"("proposal_id");

-- AddForeignKey
ALTER TABLE "bank_information" ADD CONSTRAINT "bank_information_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_data" ADD CONSTRAINT "client_data_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees_permissions" ADD CONSTRAINT "employees_permissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_content_type_id_fkey" FOREIGN KEY ("content_type_id") REFERENCES "content_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "room_chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_proposal_id_fkey" FOREIGN KEY ("proposal_id") REFERENCES "proposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_status_fkey" FOREIGN KEY ("status") REFERENCES "payment_status"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposal" ADD CONSTRAINT "proposal_accreditation_type_id_fkey" FOREIGN KEY ("accreditation_type_id") REFERENCES "accreditation_type"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposal" ADD CONSTRAINT "proposal_project_beneficiaries_fkey" FOREIGN KEY ("project_beneficiaries") REFERENCES "proposal_beneficiaries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposal" ADD CONSTRAINT "proposal_project_kind_id_fkey" FOREIGN KEY ("project_track") REFERENCES "project_tracks"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "proposal" ADD CONSTRAINT "proposal_project_manager_id_fkey" FOREIGN KEY ("project_manager_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposal" ADD CONSTRAINT "proposal_proposal_bank_id_fkey" FOREIGN KEY ("proposal_bank_id") REFERENCES "bank_information"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposal" ADD CONSTRAINT "proposal_requested_fkey" FOREIGN KEY ("outter_status") REFERENCES "proposal_request"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "proposal" ADD CONSTRAINT "proposal_state_fkey" FOREIGN KEY ("state") REFERENCES "user_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "proposal" ADD CONSTRAINT "proposal_status_fkey" FOREIGN KEY ("inner_status") REFERENCES "proposal_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "proposal" ADD CONSTRAINT "proposal_step_fkey" FOREIGN KEY ("step") REFERENCES "proposal_step"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "proposal" ADD CONSTRAINT "proposal_submitter_user_id_fkey" FOREIGN KEY ("submitter_user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposal" ADD CONSTRAINT "proposal_supervisor_id_fkey" FOREIGN KEY ("supervisor_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposal" ADD CONSTRAINT "proposal_support_goal_id_fkey" FOREIGN KEY ("support_goal_id") REFERENCES "support_goal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposal" ADD CONSTRAINT "proposal_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "track"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "proposal_comment" ADD CONSTRAINT "proposal_comment_proposal_id_fkey" FOREIGN KEY ("proposal_id") REFERENCES "proposal"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "proposal_item_budget" ADD CONSTRAINT "proposal_item_budget_proposal_id_fkey" FOREIGN KEY ("proposal_id") REFERENCES "proposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposal_log" ADD CONSTRAINT "proposal_log_assign_fkey" FOREIGN KEY ("state") REFERENCES "user_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "proposal_log" ADD CONSTRAINT "proposal_log_proposal_id_fkey" FOREIGN KEY ("proposal_id") REFERENCES "proposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposal_log" ADD CONSTRAINT "proposal_log_user_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_employee_path_fkey" FOREIGN KEY ("employee_path") REFERENCES "project_tracks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_user_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "user_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "proposal_assign" ADD CONSTRAINT "proposal_assign_assign_fkey" FOREIGN KEY ("assign") REFERENCES "user_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "proposal_assign" ADD CONSTRAINT "proposal_assign_proposal_id_fkey" FOREIGN KEY ("proposal_id") REFERENCES "proposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposal_follow_up" ADD CONSTRAINT "proposal_follow_up_proposal_id_fkey" FOREIGN KEY ("proposal_id") REFERENCES "proposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposal_follow_up" ADD CONSTRAINT "proposal_follow_up_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_log" ADD CONSTRAINT "client_log_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "client_data"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_log" ADD CONSTRAINT "client_log_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_log" ADD CONSTRAINT "client_log_status_fkey" FOREIGN KEY ("status") REFERENCES "user_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "supervisor" ADD CONSTRAINT "supervisor_proposal_id_fkey" FOREIGN KEY ("proposal_id") REFERENCES "proposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cheque" ADD CONSTRAINT "cheque_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_chat" ADD CONSTRAINT "room_chat_correspondance_category_fkey" FOREIGN KEY ("correspondance_category_id") REFERENCES "correspondance_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "room_chat" ADD CONSTRAINT "room_chat_participant1_user_id_fkey" FOREIGN KEY ("participant1_user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_chat" ADD CONSTRAINT "room_chat_participant2_user_id_fkey" FOREIGN KEY ("participant2_user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_us" ADD CONSTRAINT "message_inquiry_type_fkey" FOREIGN KEY ("inquiry_type") REFERENCES "inquiry_type"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "contact_us" ADD CONSTRAINT "message_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "contact_us" ADD CONSTRAINT "message_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule" ADD CONSTRAINT "schedule_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_record" ADD CONSTRAINT "email_record_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "email_record" ADD CONSTRAINT "email_record_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "recommended_support_consultant" ADD CONSTRAINT "recommended_support_consultant_proposal_id_fkey" FOREIGN KEY ("proposal_id") REFERENCES "proposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "track_section" ADD CONSTRAINT "track_section_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "track_section"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_user_type_id_fkey" FOREIGN KEY ("user_type_id") REFERENCES "user_type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "appointment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_proposal_id_fkey" FOREIGN KEY ("proposal_id") REFERENCES "proposal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_proposal_log_id_fkey" FOREIGN KEY ("proposal_log_id") REFERENCES "proposal_log"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_status_log" ADD CONSTRAINT "user_status_log_account_manager_id_fkey" FOREIGN KEY ("account_manager_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_status_log" ADD CONSTRAINT "user_status_log_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "user_status"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_status_log" ADD CONSTRAINT "user_status_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "edit_requests" ADD CONSTRAINT "edit_request_logs_reviwer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "edit_requests" ADD CONSTRAINT "edit_request_logs_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "edit_request_status"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "edit_requests" ADD CONSTRAINT "edit_request_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_manager" ADD CONSTRAINT "file_manager_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposal_edit_request" ADD CONSTRAINT "proposal_edit_request_proposal_id_fkey" FOREIGN KEY ("proposal_id") REFERENCES "proposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposal_edit_request" ADD CONSTRAINT "proposal_edit_request_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposal_edit_request" ADD CONSTRAINT "proposal_edit_request_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposal_asked_edit_request" ADD CONSTRAINT "proposal_asked_edit_request_proposal_id_fkey" FOREIGN KEY ("proposal_id") REFERENCES "proposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposal_asked_edit_request" ADD CONSTRAINT "proposal_asked_edit_request_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposal_asked_edit_request" ADD CONSTRAINT "proposal_asked_edit_request_supervisor_id_fkey" FOREIGN KEY ("supervisor_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposal_closing_report" ADD CONSTRAINT "closing_report_request_proposal_id_fkey" FOREIGN KEY ("proposal_id") REFERENCES "proposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "propsal_bank_information" ADD CONSTRAINT "propsal_bank_information_bank_information_id_fkey" FOREIGN KEY ("bank_information_id") REFERENCES "bank_information"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "propsal_bank_information" ADD CONSTRAINT "propsal_bank_information_proposal_id_fkey" FOREIGN KEY ("proposal_id") REFERENCES "proposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

