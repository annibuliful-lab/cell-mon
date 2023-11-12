/*
  Warnings:

  - You are about to drop the column `ci` on the `phone_cell_info` table. All the data in the column will be lost.
  - You are about to drop the column `eci` on the `phone_cell_info` table. All the data in the column will be lost.
  - You are about to drop the column `enb` on the `phone_cell_info` table. All the data in the column will be lost.
  - You are about to drop the column `lcid` on the `phone_cell_info` table. All the data in the column will be lost.
  - You are about to drop the column `nci` on the `phone_cell_info` table. All the data in the column will be lost.
  - You are about to drop the column `tac` on the `phone_cell_info` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `phone_network` table. All the data in the column will be lost.
  - Added the required column `range` to the `phone_cell_info` table without a default value. This is not possible if the table is not empty.
  - Made the column `cid` on table `phone_cell_info` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lac` on table `phone_cell_info` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `country` to the `phone_network` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "phone_cell_info" DROP COLUMN "ci",
DROP COLUMN "eci",
DROP COLUMN "enb",
DROP COLUMN "lcid",
DROP COLUMN "nci",
DROP COLUMN "tac",
ADD COLUMN     "range" TEXT NOT NULL,
ALTER COLUMN "cid" SET NOT NULL,
ALTER COLUMN "lac" SET NOT NULL;

-- AlterTable
ALTER TABLE "phone_network" DROP COLUMN "name",
ADD COLUMN     "country" TEXT NOT NULL;
