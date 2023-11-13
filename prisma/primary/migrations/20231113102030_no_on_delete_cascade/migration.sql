-- DropForeignKey
ALTER TABLE "account_configuration" DROP CONSTRAINT "account_configuration_accountId_fkey";

-- DropForeignKey
ALTER TABLE "mission" DROP CONSTRAINT "mission_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "mission_target" DROP CONSTRAINT "mission_target_missionId_fkey";

-- DropForeignKey
ALTER TABLE "mission_target" DROP CONSTRAINT "mission_target_targetId_fkey";

-- DropForeignKey
ALTER TABLE "phone_cell_info" DROP CONSTRAINT "phone_cell_info_phoneTargetLocationId_fkey";

-- DropForeignKey
ALTER TABLE "phone_geo_location" DROP CONSTRAINT "phone_geo_location_phoneTargetLocationId_fkey";

-- DropForeignKey
ALTER TABLE "phone_network" DROP CONSTRAINT "phone_network_phoneTargetLocationId_fkey";

-- DropForeignKey
ALTER TABLE "phone_target" DROP CONSTRAINT "phone_target_phoneId_fkey";

-- DropForeignKey
ALTER TABLE "phone_target" DROP CONSTRAINT "phone_target_targetId_fkey";

-- DropForeignKey
ALTER TABLE "session_token" DROP CONSTRAINT "session_token_accountId_fkey";

-- DropForeignKey
ALTER TABLE "target" DROP CONSTRAINT "target_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "target_evidence" DROP CONSTRAINT "target_evidence_targetId_fkey";

-- DropForeignKey
ALTER TABLE "workspace_account" DROP CONSTRAINT "workspace_account_accountId_fkey";

-- DropForeignKey
ALTER TABLE "workspace_account" DROP CONSTRAINT "workspace_account_roleId_fkey";

-- DropForeignKey
ALTER TABLE "workspace_account" DROP CONSTRAINT "workspace_account_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "workspace_configuration" DROP CONSTRAINT "workspace_configuration_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "workspace_role" DROP CONSTRAINT "workspace_role_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "workspace_role_permission" DROP CONSTRAINT "workspace_role_permission_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "workspace_role_permission" DROP CONSTRAINT "workspace_role_permission_roleId_fkey";

-- DropForeignKey
ALTER TABLE "workspace_role_permission" DROP CONSTRAINT "workspace_role_permission_workspaceId_fkey";

-- AddForeignKey
ALTER TABLE "account_configuration" ADD CONSTRAINT "account_configuration_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_token" ADD CONSTRAINT "session_token_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_configuration" ADD CONSTRAINT "workspace_configuration_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_role" ADD CONSTRAINT "workspace_role_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_role_permission" ADD CONSTRAINT "workspace_role_permission_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_role_permission" ADD CONSTRAINT "workspace_role_permission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "workspace_role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_role_permission" ADD CONSTRAINT "workspace_role_permission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_account" ADD CONSTRAINT "workspace_account_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_account" ADD CONSTRAINT "workspace_account_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_account" ADD CONSTRAINT "workspace_account_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "workspace_role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission" ADD CONSTRAINT "mission_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "target" ADD CONSTRAINT "target_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_target" ADD CONSTRAINT "mission_target_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "mission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_target" ADD CONSTRAINT "mission_target_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "target"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "target_evidence" ADD CONSTRAINT "target_evidence_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "target"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "phone_target" ADD CONSTRAINT "phone_target_phoneId_fkey" FOREIGN KEY ("phoneId") REFERENCES "phone_metadata"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "phone_target" ADD CONSTRAINT "phone_target_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "target"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "phone_network" ADD CONSTRAINT "phone_network_phoneTargetLocationId_fkey" FOREIGN KEY ("phoneTargetLocationId") REFERENCES "phone_target_location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "phone_cell_info" ADD CONSTRAINT "phone_cell_info_phoneTargetLocationId_fkey" FOREIGN KEY ("phoneTargetLocationId") REFERENCES "phone_target_location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "phone_geo_location" ADD CONSTRAINT "phone_geo_location_phoneTargetLocationId_fkey" FOREIGN KEY ("phoneTargetLocationId") REFERENCES "phone_target_location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
