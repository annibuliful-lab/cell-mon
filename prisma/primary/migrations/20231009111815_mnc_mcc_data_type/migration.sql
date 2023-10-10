/*
  Warnings:

  - You are about to alter the column `mnc` on the `phone_network` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(3)`.
  - You are about to alter the column `mcc` on the `phone_network` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(3)`.

*/
-- AlterTable
ALTER TABLE "phone_network" ALTER COLUMN "mnc" SET DATA TYPE VARCHAR(3),
ALTER COLUMN "mcc" SET DATA TYPE VARCHAR(3);
