/*
  Warnings:

  - Added the required column `apiKey` to the `workspace_configuration` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "workspace_configuration" ADD COLUMN     "apiKey" TEXT NOT NULL;
