/*
  Warnings:

  - You are about to drop the column `imsi` on the `phone_metadata` table. All the data in the column will be lost.
  - You are about to drop the column `msisdn` on the `phone_metadata` table. All the data in the column will be lost.
  - Added the required column `msisdnId` to the `phone_metadata` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "phone_metadata_imsi_msisdn_key";

-- AlterTable
ALTER TABLE "phone_metadata" DROP COLUMN "imsi",
DROP COLUMN "msisdn",
ADD COLUMN     "imsiId" UUID,
ADD COLUMN     "msisdnId" UUID NOT NULL;

-- CreateTable
CREATE TABLE "phone_metadata_imsi" (
    "id" UUID NOT NULL,
    "imsi" TEXT NOT NULL,
    "operator" TEXT NOT NULL,
    "mcc" TEXT NOT NULL,
    "mnc" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "phone_metadata_imsi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "phone_metadata_msisdn" (
    "id" UUID NOT NULL,
    "msisdn" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "phone_metadata_msisdn_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "phone_metadata_imsi_imsi_operator_idx" ON "phone_metadata_imsi"("imsi", "operator");

-- CreateIndex
CREATE UNIQUE INDEX "phone_metadata_imsi_imsi_mcc_mnc_operator_key" ON "phone_metadata_imsi"("imsi", "mcc", "mnc", "operator");

-- CreateIndex
CREATE UNIQUE INDEX "phone_metadata_msisdn_msisdn_key" ON "phone_metadata_msisdn"("msisdn");

-- AddForeignKey
ALTER TABLE "phone_metadata" ADD CONSTRAINT "phone_metadata_msisdnId_fkey" FOREIGN KEY ("msisdnId") REFERENCES "phone_metadata_msisdn"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "phone_metadata" ADD CONSTRAINT "phone_metadata_imsiId_fkey" FOREIGN KEY ("imsiId") REFERENCES "phone_metadata_imsi"("id") ON DELETE SET NULL ON UPDATE CASCADE;
