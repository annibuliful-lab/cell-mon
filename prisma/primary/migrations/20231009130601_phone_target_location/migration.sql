/*
  Warnings:

  - You are about to drop the `phone_location` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "phone_cell_info" DROP CONSTRAINT "phone_cell_info_phoneLocationId_fkey";

-- DropForeignKey
ALTER TABLE "phone_geo_location" DROP CONSTRAINT "phone_geo_location_phoneLocationId_fkey";

-- DropForeignKey
ALTER TABLE "phone_location" DROP CONSTRAINT "phone_location_phoneTargetId_fkey";

-- DropForeignKey
ALTER TABLE "phone_network" DROP CONSTRAINT "phone_network_phoneLocationId_fkey";

-- DropTable
DROP TABLE "phone_location";

-- CreateTable
CREATE TABLE "phone_target_location" (
    "id" UUID NOT NULL,
    "phoneTargetId" UUID NOT NULL,
    "metadata" JSONB,
    "createdBy" TEXT NOT NULL,
    "sourceDateTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "phone_target_location_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "phone_target_location" ADD CONSTRAINT "phone_target_location_phoneTargetId_fkey" FOREIGN KEY ("phoneTargetId") REFERENCES "phone_target"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "phone_network" ADD CONSTRAINT "phone_network_phoneLocationId_fkey" FOREIGN KEY ("phoneLocationId") REFERENCES "phone_target_location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "phone_cell_info" ADD CONSTRAINT "phone_cell_info_phoneLocationId_fkey" FOREIGN KEY ("phoneLocationId") REFERENCES "phone_target_location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "phone_geo_location" ADD CONSTRAINT "phone_geo_location_phoneLocationId_fkey" FOREIGN KEY ("phoneLocationId") REFERENCES "phone_target_location"("id") ON DELETE CASCADE ON UPDATE CASCADE;
