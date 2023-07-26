-- DropForeignKey
ALTER TABLE "appointment" DROP CONSTRAINT "appointment_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "appointment" DROP CONSTRAINT "appointment_user_id_fkey";

-- DropForeignKey
ALTER TABLE "bank_information" DROP CONSTRAINT "bank_information_user_id_fkey";

-- DropForeignKey
ALTER TABLE "client_data" DROP CONSTRAINT "client_data_user_id_fkey";

-- DropForeignKey
ALTER TABLE "client_log" DROP CONSTRAINT "client_log_reviewer_id_fkey";

-- DropForeignKey
ALTER TABLE "contact_us" DROP CONSTRAINT "message_receiver_id_fkey";

-- DropForeignKey
ALTER TABLE "contact_us" DROP CONSTRAINT "message_sender_id_fkey";

-- DropForeignKey
ALTER TABLE "edit_requests" DROP CONSTRAINT "edit_request_logs_reviwer_id_fkey";

-- DropForeignKey
ALTER TABLE "edit_requests" DROP CONSTRAINT "edit_request_logs_user_id_fkey";

-- DropForeignKey
ALTER TABLE "email_record" DROP CONSTRAINT "email_record_receiver_id_fkey";

-- DropForeignKey
ALTER TABLE "email_record" DROP CONSTRAINT "email_record_sender_id_fkey";

-- DropForeignKey
ALTER TABLE "employees_permissions" DROP CONSTRAINT "employees_permissions_user_id_fkey";

-- DropForeignKey
ALTER TABLE "file_manager" DROP CONSTRAINT "file_manager_user_id_fkey";

-- DropForeignKey
ALTER TABLE "message" DROP CONSTRAINT "message_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "message" DROP CONSTRAINT "message_receiver_id_fkey";

-- DropForeignKey
ALTER TABLE "notification" DROP CONSTRAINT "notification_user_id_fkey";

-- DropForeignKey
ALTER TABLE "proposal" DROP CONSTRAINT "proposal_project_manager_id_fkey";

-- DropForeignKey
ALTER TABLE "proposal" DROP CONSTRAINT "proposal_submitter_user_id_fkey";

-- DropForeignKey
ALTER TABLE "proposal" DROP CONSTRAINT "proposal_supervisor_id_fkey";

-- DropForeignKey
ALTER TABLE "proposal_asked_edit_request" DROP CONSTRAINT "proposal_asked_edit_request_sender_id_fkey";

-- DropForeignKey
ALTER TABLE "proposal_asked_edit_request" DROP CONSTRAINT "proposal_asked_edit_request_supervisor_id_fkey";

-- DropForeignKey
ALTER TABLE "proposal_edit_request" DROP CONSTRAINT "proposal_edit_request_reviewer_id_fkey";

-- DropForeignKey
ALTER TABLE "proposal_edit_request" DROP CONSTRAINT "proposal_edit_request_user_id_fkey";

-- DropForeignKey
ALTER TABLE "proposal_follow_up" DROP CONSTRAINT "proposal_follow_up_user_id_fkey";

-- DropForeignKey
ALTER TABLE "proposal_log" DROP CONSTRAINT "proposal_log_user_id_fkey";

-- DropForeignKey
ALTER TABLE "room_chat" DROP CONSTRAINT "room_chat_participant1_user_id_fkey";

-- DropForeignKey
ALTER TABLE "room_chat" DROP CONSTRAINT "room_chat_participant2_user_id_fkey";

-- DropForeignKey
ALTER TABLE "schedule" DROP CONSTRAINT "schedule_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_role" DROP CONSTRAINT "user_role_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_role" DROP CONSTRAINT "user_role_user_type_id_fkey";

-- DropForeignKey
ALTER TABLE "user_status_log" DROP CONSTRAINT "user_status_log_account_manager_id_fkey";

-- DropForeignKey
ALTER TABLE "user_status_log" DROP CONSTRAINT "user_status_log_user_id_fkey";

-- AddForeignKey
ALTER TABLE "bank_information" ADD CONSTRAINT "bank_information_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "client_data" ADD CONSTRAINT "client_data_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "employees_permissions" ADD CONSTRAINT "employees_permissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "proposal" ADD CONSTRAINT "proposal_project_manager_id_fkey" FOREIGN KEY ("project_manager_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "proposal" ADD CONSTRAINT "proposal_submitter_user_id_fkey" FOREIGN KEY ("submitter_user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "proposal" ADD CONSTRAINT "proposal_supervisor_id_fkey" FOREIGN KEY ("supervisor_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "proposal_log" ADD CONSTRAINT "proposal_log_user_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "proposal_follow_up" ADD CONSTRAINT "proposal_follow_up_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "client_log" ADD CONSTRAINT "client_log_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "room_chat" ADD CONSTRAINT "room_chat_participant1_user_id_fkey" FOREIGN KEY ("participant1_user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "room_chat" ADD CONSTRAINT "room_chat_participant2_user_id_fkey" FOREIGN KEY ("participant2_user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "contact_us" ADD CONSTRAINT "message_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "contact_us" ADD CONSTRAINT "message_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "schedule" ADD CONSTRAINT "schedule_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "email_record" ADD CONSTRAINT "email_record_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "email_record" ADD CONSTRAINT "email_record_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_user_type_id_fkey" FOREIGN KEY ("user_type_id") REFERENCES "user_type"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "user_status_log" ADD CONSTRAINT "user_status_log_account_manager_id_fkey" FOREIGN KEY ("account_manager_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "user_status_log" ADD CONSTRAINT "user_status_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "edit_requests" ADD CONSTRAINT "edit_request_logs_reviwer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "edit_requests" ADD CONSTRAINT "edit_request_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "file_manager" ADD CONSTRAINT "file_manager_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "proposal_edit_request" ADD CONSTRAINT "proposal_edit_request_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "proposal_edit_request" ADD CONSTRAINT "proposal_edit_request_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "proposal_asked_edit_request" ADD CONSTRAINT "proposal_asked_edit_request_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "proposal_asked_edit_request" ADD CONSTRAINT "proposal_asked_edit_request_supervisor_id_fkey" FOREIGN KEY ("supervisor_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;
