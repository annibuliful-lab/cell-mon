/*
  Warnings:

  - A unique constraint covering the columns `[missionId,targetId]` on the table `mission_target` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "mission_target_missionId_targetId_key" ON "mission_target"("missionId", "targetId");
