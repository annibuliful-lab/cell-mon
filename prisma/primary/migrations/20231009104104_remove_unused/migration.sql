/*
  Warnings:

  - You are about to drop the column `roaming` on the `phone_network` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionStatus` on the `phone_network` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "phone_network" DROP COLUMN "roaming",
DROP COLUMN "subscriptionStatus";
