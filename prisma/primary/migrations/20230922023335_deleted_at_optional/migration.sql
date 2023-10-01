-- AlterTable
ALTER TABLE "mission" ALTER COLUMN "deletedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "mission_target" ALTER COLUMN "deletedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "phone_target" ALTER COLUMN "deletedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "target_evidence" ALTER COLUMN "deletedAt" DROP NOT NULL;
