/*
  Warnings:

  - The primary key for the `mission_target` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `id` was added to the `mission_target` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "mission_target" DROP CONSTRAINT "mission_target_pkey",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "mission_target_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "target" ALTER COLUMN "deletedAt" DROP NOT NULL;
