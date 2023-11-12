/*
  Warnings:

  - A unique constraint covering the columns `[apiKey]` on the table `workspace_configuration` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `apiKey` to the `workspace_configuration` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "workspace_configuration" ADD COLUMN     "apiKey" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "workspace_configuration_apiKey_key" ON "workspace_configuration"("apiKey");
