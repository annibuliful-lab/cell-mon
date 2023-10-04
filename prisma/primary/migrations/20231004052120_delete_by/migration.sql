/*
  Warnings:

  - You are about to drop the column `updatedBy` on the `target` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "mission" ADD COLUMN     "deleteBy" TEXT;

-- AlterTable
ALTER TABLE "mission_target" ADD COLUMN     "deleteBy" TEXT;

-- AlterTable
ALTER TABLE "phone_target" ADD COLUMN     "deleteBy" TEXT;

-- AlterTable
ALTER TABLE "target" DROP COLUMN "updatedBy",
ADD COLUMN     "deleteBy" TEXT;

-- AlterTable
ALTER TABLE "target_evidence" ADD COLUMN     "deleteBy" TEXT;
