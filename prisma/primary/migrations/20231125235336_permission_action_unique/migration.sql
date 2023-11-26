/*
  Warnings:

  - A unique constraint covering the columns `[subject,action]` on the table `permission` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "permission_subject_action_key" ON "permission"("subject", "action");
