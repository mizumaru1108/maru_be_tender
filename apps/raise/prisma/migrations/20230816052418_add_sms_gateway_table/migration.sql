-- CreateTable
CREATE TABLE "sms_gateways" (
    "id" TEXT NOT NULL,
    "api_key" TEXT NOT NULL,
    "user_sender" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "sms_gateways_pkey" PRIMARY KEY ("id")
);
