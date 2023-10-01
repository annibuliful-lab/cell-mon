/*
  Warnings:

  - You are about to drop the column `name` on the `mission` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `target` table. All the data in the column will be lost.
  - Added the required column `title` to the `mission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `target` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "mission" DROP COLUMN "name",
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "target" DROP COLUMN "name",
ADD COLUMN     "title" TEXT NOT NULL;
