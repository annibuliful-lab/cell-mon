/*
  Warnings:

  - The primary key for the `phone_operator` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[mnc,mcc]` on the table `phone_operator` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `phone_operator` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "phone_operator" DROP CONSTRAINT "phone_operator_pkey",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "phone_operator_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "phone_operator_mnc_mcc_key" ON "phone_operator"("mnc", "mcc");
