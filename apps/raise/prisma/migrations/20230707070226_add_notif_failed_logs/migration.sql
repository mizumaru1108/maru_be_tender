-- CreateTable
CREATE TABLE "notification_failed_logs" (
    "id" TEXT NOT NULL,
    "error_log" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,

    CONSTRAINT "notification_failed_logs_pkey" PRIMARY KEY ("id")
);
