-- CreateEnum
CREATE TYPE "PermissionAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'READ');

-- CreateEnum
CREATE TYPE "CellularTechnology" AS ENUM ('NR', 'LTE', 'GSM', 'WCDMA');

-- CreateEnum
CREATE TYPE "MissionStatus" AS ENUM ('DRAFT', 'PLANNING', 'INVESTIGATING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "permission" (
    "id" UUID NOT NULL,
    "subject" TEXT NOT NULL,
    "action" "PermissionAction" NOT NULL,

    CONSTRAINT "permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" UUID NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account_configuration" (
    "accountId" UUID NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "account_configuration_pkey" PRIMARY KEY ("accountId")
);

-- CreateTable
CREATE TABLE "session_token" (
    "token" TEXT NOT NULL,
    "revoke" BOOLEAN NOT NULL DEFAULT false,
    "accountId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "session_token_pkey" PRIMARY KEY ("token")
);

-- CreateTable
CREATE TABLE "workspace" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "workspace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workspace_configuration" (
    "workspaceId" UUID NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "workspace_configuration_pkey" PRIMARY KEY ("workspaceId")
);

-- CreateTable
CREATE TABLE "workspace_role" (
    "id" UUID NOT NULL,
    "workspaceId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "workspace_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workspace_role_permission" (
    "id" TEXT NOT NULL,
    "workspaceId" UUID NOT NULL,
    "roleId" UUID NOT NULL,
    "permissionId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "workspace_role_permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workspace_account" (
    "id" UUID NOT NULL,
    "workspaceId" UUID NOT NULL,
    "accountId" UUID NOT NULL,
    "roleId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "workspace_account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "phone_metadata" (
    "id" UUID NOT NULL,
    "msisdn" TEXT NOT NULL,
    "imsi" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "phone_metadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mission" (
    "id" UUID NOT NULL,
    "workspaceId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "MissionStatus" NOT NULL DEFAULT 'DRAFT',
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "mission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "target" (
    "id" UUID NOT NULL,
    "workspaceId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "photoUrl" TEXT,
    "address" TEXT,
    "metadata" JSONB,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "target_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mission_target" (
    "missionId" UUID NOT NULL,
    "targetId" UUID NOT NULL,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "mission_target_pkey" PRIMARY KEY ("missionId","targetId")
);

-- CreateTable
CREATE TABLE "target_evidence" (
    "id" UUID NOT NULL,
    "targetId" UUID NOT NULL,
    "evidence" JSONB,
    "note" TEXT NOT NULL,
    "investigatedDate" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "target_evidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "phone_target" (
    "id" UUID NOT NULL,
    "phoneId" UUID NOT NULL,
    "targetId" UUID NOT NULL,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "phone_target_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "phone_location" (
    "id" UUID NOT NULL,
    "phoneTargetId" UUID NOT NULL,
    "metadata" JSONB,
    "createdBy" TEXT NOT NULL,
    "sourceDateTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "phone_location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "phone_network" (
    "phoneLocationId" UUID NOT NULL,
    "subscriptionStatus" TEXT NOT NULL,
    "roaming" BOOLEAN NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "operator" TEXT NOT NULL,
    "mnc" TEXT NOT NULL,
    "mcc" TEXT NOT NULL,

    CONSTRAINT "phone_network_pkey" PRIMARY KEY ("phoneLocationId")
);

-- CreateTable
CREATE TABLE "phone_cell_info" (
    "phoneLocationId" UUID NOT NULL,
    "type" "CellularTechnology" NOT NULL,
    "cid" TEXT,
    "lcid" TEXT,
    "lac" TEXT,
    "ci" TEXT,
    "eci" TEXT,
    "tac" TEXT,
    "enb" TEXT,
    "nci" TEXT,

    CONSTRAINT "phone_cell_info_pkey" PRIMARY KEY ("phoneLocationId")
);

-- CreateTable
CREATE TABLE "phone_geo_location" (
    "id" UUID NOT NULL,
    "phoneLocationId" UUID NOT NULL,
    "latitude" DECIMAL(8,6) NOT NULL,
    "longtitude" DECIMAL(9,6) NOT NULL,
    "source" TEXT NOT NULL,

    CONSTRAINT "phone_geo_location_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "phone_metadata_imsi_msisdn_key" ON "phone_metadata"("imsi", "msisdn");

-- AddForeignKey
ALTER TABLE "account_configuration" ADD CONSTRAINT "account_configuration_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_token" ADD CONSTRAINT "session_token_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_configuration" ADD CONSTRAINT "workspace_configuration_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_role" ADD CONSTRAINT "workspace_role_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_role_permission" ADD CONSTRAINT "workspace_role_permission_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_role_permission" ADD CONSTRAINT "workspace_role_permission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "workspace_role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_role_permission" ADD CONSTRAINT "workspace_role_permission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_account" ADD CONSTRAINT "workspace_account_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_account" ADD CONSTRAINT "workspace_account_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_account" ADD CONSTRAINT "workspace_account_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "workspace_role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission" ADD CONSTRAINT "mission_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "target" ADD CONSTRAINT "target_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_target" ADD CONSTRAINT "mission_target_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_target" ADD CONSTRAINT "mission_target_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "target"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "target_evidence" ADD CONSTRAINT "target_evidence_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "target"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "phone_target" ADD CONSTRAINT "phone_target_phoneId_fkey" FOREIGN KEY ("phoneId") REFERENCES "phone_metadata"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "phone_target" ADD CONSTRAINT "phone_target_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "target"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "phone_location" ADD CONSTRAINT "phone_location_phoneTargetId_fkey" FOREIGN KEY ("phoneTargetId") REFERENCES "phone_target"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "phone_network" ADD CONSTRAINT "phone_network_phoneLocationId_fkey" FOREIGN KEY ("phoneLocationId") REFERENCES "phone_location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "phone_cell_info" ADD CONSTRAINT "phone_cell_info_phoneLocationId_fkey" FOREIGN KEY ("phoneLocationId") REFERENCES "phone_location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "phone_geo_location" ADD CONSTRAINT "phone_geo_location_phoneLocationId_fkey" FOREIGN KEY ("phoneLocationId") REFERENCES "phone_location"("id") ON DELETE CASCADE ON UPDATE CASCADE;
