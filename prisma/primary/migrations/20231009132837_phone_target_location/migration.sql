/*
  Warnings:

  - The primary key for the `phone_cell_info` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `phoneLocationId` on the `phone_cell_info` table. All the data in the column will be lost.
  - You are about to drop the column `phoneLocationId` on the `phone_geo_location` table. All the data in the column will be lost.
  - The primary key for the `phone_network` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `phoneLocationId` on the `phone_network` table. All the data in the column will be lost.
  - Added the required column `phoneTargetLocationId` to the `phone_cell_info` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneTargetLocationId` to the `phone_geo_location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneTargetLocationId` to the `phone_network` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "phone_cell_info" DROP CONSTRAINT "phone_cell_info_phoneLocationId_fkey";

-- DropForeignKey
ALTER TABLE "phone_geo_location" DROP CONSTRAINT "phone_geo_location_phoneLocationId_fkey";

-- DropForeignKey
ALTER TABLE "phone_network" DROP CONSTRAINT "phone_network_phoneLocationId_fkey";

-- AlterTable
ALTER TABLE "phone_cell_info" DROP CONSTRAINT "phone_cell_info_pkey",
DROP COLUMN "phoneLocationId",
ADD COLUMN     "phoneTargetLocationId" UUID NOT NULL,
ADD CONSTRAINT "phone_cell_info_pkey" PRIMARY KEY ("phoneTargetLocationId");

-- AlterTable
ALTER TABLE "phone_geo_location" DROP COLUMN "phoneLocationId",
ADD COLUMN     "phoneTargetLocationId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "phone_network" DROP CONSTRAINT "phone_network_pkey",
DROP COLUMN "phoneLocationId",
ADD COLUMN     "phoneTargetLocationId" UUID NOT NULL,
ADD CONSTRAINT "phone_network_pkey" PRIMARY KEY ("phoneTargetLocationId");

-- AddForeignKey
ALTER TABLE "phone_network" ADD CONSTRAINT "phone_network_phoneTargetLocationId_fkey" FOREIGN KEY ("phoneTargetLocationId") REFERENCES "phone_target_location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "phone_cell_info" ADD CONSTRAINT "phone_cell_info_phoneTargetLocationId_fkey" FOREIGN KEY ("phoneTargetLocationId") REFERENCES "phone_target_location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "phone_geo_location" ADD CONSTRAINT "phone_geo_location_phoneTargetLocationId_fkey" FOREIGN KEY ("phoneTargetLocationId") REFERENCES "phone_target_location"("id") ON DELETE CASCADE ON UPDATE CASCADE;
