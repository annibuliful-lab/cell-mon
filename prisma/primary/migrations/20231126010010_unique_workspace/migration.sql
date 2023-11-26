/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `workspace` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "workspace_title_key" ON "workspace"("title");
