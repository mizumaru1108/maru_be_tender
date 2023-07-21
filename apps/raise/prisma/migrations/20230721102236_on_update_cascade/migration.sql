-- DropForeignKey
ALTER TABLE "client_log" DROP CONSTRAINT "client_log_status_fkey";

-- DropForeignKey
ALTER TABLE "contact_us" DROP CONSTRAINT "message_inquiry_type_fkey";

-- DropForeignKey
ALTER TABLE "contact_us" DROP CONSTRAINT "message_receiver_id_fkey";

-- DropForeignKey
ALTER TABLE "contact_us" DROP CONSTRAINT "message_sender_id_fkey";

-- DropForeignKey
ALTER TABLE "email_record" DROP CONSTRAINT "email_record_receiver_id_fkey";

-- DropForeignKey
ALTER TABLE "email_record" DROP CONSTRAINT "email_record_sender_id_fkey";

-- DropForeignKey
ALTER TABLE "employees_permissions" DROP CONSTRAINT "employees_permissions_user_id_fkey";

-- DropForeignKey
ALTER TABLE "message" DROP CONSTRAINT "message_receiver_id_fkey";

-- DropForeignKey
ALTER TABLE "proposal_log" DROP CONSTRAINT "proposal_log_user_id_fkey";

-- AddForeignKey
ALTER TABLE "employees_permissions" ADD CONSTRAINT "employees_permissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposal_log" ADD CONSTRAINT "proposal_log_user_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_log" ADD CONSTRAINT "client_log_status_fkey" FOREIGN KEY ("status") REFERENCES "user_status"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_us" ADD CONSTRAINT "message_inquiry_type_fkey" FOREIGN KEY ("inquiry_type") REFERENCES "inquiry_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_us" ADD CONSTRAINT "message_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_us" ADD CONSTRAINT "message_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_record" ADD CONSTRAINT "email_record_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_record" ADD CONSTRAINT "email_record_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
