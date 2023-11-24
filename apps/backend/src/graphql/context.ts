import {
  GraphqlContext,
  verifyApiKey,
  verifyLocalAuthentication,
} from '@cell-mon/graphql';
import { config } from 'dotenv';
import { FastifyRequest } from 'fastify';

import { AppContext } from '../@types/context';
import { AccountService } from '../modules/account/account.service';
import { AuthenticationService } from '../modules/authentication/authentication.service';
import { Fileservice } from '../modules/file/file.service';
import { JobService } from '../modules/job/job.service';
import { MissionService } from '../modules/mission/mission.service';
import { MissionTargetService } from '../modules/mission-target/mission-target.service';
import { PermissionAbilityService } from '../modules/permission-ability/permission-ability.service';
import { PhoneMetadataService } from '../modules/phone-metadata/phone-metadata.service';
import { PhoneTargetService } from '../modules/phone-target/phone-target.service';
import { PhoneTargetLocationService } from '../modules/phone-target-location/phone-target-location.service';
import { TargetService } from '../modules/target/target.service';
import { TargetEvidenceService } from '../modules/target-evidence/target-evidence.service';
import { WorkspaceService } from '../modules/workspace/workspace.service';

config();

export const graphqlContext = async ({
  headers,
}: FastifyRequest): Promise<AppContext> => {
  const authProvider = headers['x-auth-provider'] as string;
  const accessToken = headers['access-token'] as string;
  const authorization = headers['authorization'] as string;
  const workspaceId = headers['x-workspace-id'] as string;
  const apiKey = headers['x-api-key'] as string;

  if (apiKey) {
    const workspace = await verifyApiKey({ apiKey });
    const context: GraphqlContext = {
      authProvider,
      accessToken,
      authorization,
      accountId: apiKey,
      permissions: [],
      role: 'API_KEY',
      workspaceId: workspace.workspaceId,
      projectFeatureFlags: [],
      apiKey: workspace.apiKey,
    };

    return {
      ...context,
      phoneTargetLocationService: new PhoneTargetLocationService(context),
      phoneMetadataService: new PhoneMetadataService(context),
    } as AppContext;
  }

  if (!authorization) {
    const context = {
      authProvider,
      accessToken,
      authorization,
      accountId: null as unknown as string,
      permissions: [],
      role: 'Guest',
      workspaceId,
      projectFeatureFlags: [],
    };

    return {
      ...context,
      authenticationService: new AuthenticationService(context),
      accountService: new AccountService(context),
      workspaceService: new WorkspaceService(context),
      fileservice: new Fileservice(context),
    } as unknown as AppContext;
  }

  const { accountId, role, permissions } = await verifyLocalAuthentication({
    token: authorization,
    workspaceId,
  });

  const context: GraphqlContext = {
    authProvider,
    accessToken,
    authorization,
    accountId: accountId.toString(),
    permissions,
    role: role as string,
    projectFeatureFlags: [],
    workspaceId,
  };

  return {
    ...context,
    targetEvidenceService: new TargetEvidenceService(context),
    missionTargetService: new MissionTargetService(context),
    targetService: new TargetService(context),
    workspaceService: new WorkspaceService(context),
    authenticationService: new AuthenticationService(context),
    accountService: new AccountService(context),
    permissionAbilityService: new PermissionAbilityService(context),
    fileservice: new Fileservice(context),
    phoneMetadataService: new PhoneMetadataService(context),
    missionService: new MissionService(context),
    phoneTargetService: new PhoneTargetService(context),
    phoneTargetLocationService: new PhoneTargetLocationService(context),
    jobService: new JobService(context),
  } as AppContext;
};
