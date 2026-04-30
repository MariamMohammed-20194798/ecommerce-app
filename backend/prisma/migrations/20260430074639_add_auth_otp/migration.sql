/*
  Warnings:

  - You are about to drop the column `passwordHash` on the `users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "OtpType" AS ENUM ('LOGIN', 'SIGNUP');

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "images" TEXT[];

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "images" TEXT[];

-- AlterTable
ALTER TABLE "users" DROP COLUMN "passwordHash",
ADD COLUMN     "name" TEXT;

-- CreateTable
CREATE TABLE "auth_otps" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" "OtpType" NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auth_otps_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "auth_otps_email_idx" ON "auth_otps"("email");
