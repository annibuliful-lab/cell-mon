/*
  Warnings:

  - The primary key for the `workspace_account` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `workspace_configuration` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `workspace_configuration` table. All the data in the column will be lost.
  - The primary key for the `workspace_role_permission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `id` to the `workspace_account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workspaceId` to the `workspace_configuration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `workspace_role_permission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "workspace_account" DROP CONSTRAINT "workspace_account_pkey",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "workspace_account_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "workspace_configuration" DROP CONSTRAINT "workspace_configuration_pkey",
DROP COLUMN "id",
ADD COLUMN     "workspaceId" UUID NOT NULL,
ADD CONSTRAINT "workspace_configuration_pkey" PRIMARY KEY ("workspaceId");

-- AlterTable
ALTER TABLE "workspace_role_permission" DROP CONSTRAINT "workspace_role_permission_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "workspace_role_permission_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "workspace_configuration" ADD CONSTRAINT "workspace_configuration_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
