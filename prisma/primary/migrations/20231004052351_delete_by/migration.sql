-- AlterTable
ALTER TABLE "mission" ADD COLUMN     "deleteBy" TEXT;

-- AlterTable
ALTER TABLE "mission_target" ADD COLUMN     "deleteBy" TEXT;

-- AlterTable
ALTER TABLE "phone_target" ADD COLUMN     "deleteBy" TEXT;

-- AlterTable
ALTER TABLE "target" ADD COLUMN     "deleteBy" TEXT;

-- AlterTable
ALTER TABLE "target_evidence" ADD COLUMN     "deleteBy" TEXT;
