-- AlterTable
ALTER TABLE "mission" ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];
