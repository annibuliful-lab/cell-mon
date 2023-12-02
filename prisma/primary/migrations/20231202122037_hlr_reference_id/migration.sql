/*
  Warnings:

  - Added the required column `hrlReferenceId` to the `phone_target_location` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "phone_target_location" ADD COLUMN     "hrlReferenceId" TEXT NOT NULL;
