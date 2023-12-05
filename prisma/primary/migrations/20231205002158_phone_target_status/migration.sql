-- CreateEnum
CREATE TYPE "PhoneTargetJobStatus" AS ENUM ('IDLE', 'IN_QUEUE', 'PROCESSING', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "phone_target_location" ADD COLUMN     "status" "PhoneTargetJobStatus" NOT NULL DEFAULT 'IDLE';
