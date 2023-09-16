import { prismaDbClient, redisClient } from '@tadchud-erp/db';
import { IJwtAuthInfo, jwtVerify } from '@tadchud-erp/utils';
import { PermissionAbility } from 'kysely-codegen';

import { AuthenticationError } from '../errors/authentication';
import { ForbiddenError } from '../errors/forbidden';

const CACHE_EXPIRE = 3600;

type AccountInfo = {
  accountUid: string;
  accountId: number;
  projectId?: number;
  role?: string;
  workspaceIds: number[];
  permissions: Pick<PermissionAbility, 'action' | 'subject'>[];
  featureFlags?: string[];
  workspaceId?: number;
};

type ValidateLocalAuthenticationParams = {
  token: string;
  projectId?: number;
};

async function getAccountInfo(userInfo: IJwtAuthInfo, projectId: number) {
  const accountId = (
    await prismaDbClient.account.findUnique({
      select: {
        id: true,
      },
      where: {
        uid: userInfo.accountId,
      },
    })
  )?.id;

  if (!accountId) {
    throw new AuthenticationError();
  }

  if (!projectId) {
    const accountInfo: AccountInfo = {
      accountUid: userInfo.accountId,
      workspaceIds: userInfo.workspaceIds,
      accountId,
      permissions: [],
      featureFlags: [],
    };

    await redisClient.set(
      userInfo.accountId,
      JSON.stringify(accountInfo),
      'EX',
      CACHE_EXPIRE
    );

    return accountInfo;
  }

  const accountProjectRole = await prismaDbClient.projectAccount.findFirst({
    select: {
      project: {
        select: {
          workspace: {
            select: {
              id: true,
              workspaceFeatureFlags: {
                select: {
                  featureFlag: {
                    select: {
                      flag: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
      role: {
        select: {
          title: true,
          rolePermissions: {
            select: {
              permissionAbility: {
                select: {
                  action: true,
                  subject: true,
                },
              },
            },
          },
        },
      },
    },
    where: {
      accountId,
      projectId,
    },
  });

  if (!accountProjectRole) {
    throw new ForbiddenError('You are not in this project');
  }

  const permissions = accountProjectRole.role.rolePermissions.map((p) => ({
    action: p.permissionAbility.action,
    subject: p.permissionAbility.subject,
  }));

  const accountInfo: AccountInfo = {
    accountUid: userInfo.accountId,
    workspaceIds: userInfo.workspaceIds,
    accountId,
    projectId,
    role: accountProjectRole.role.title,
    permissions,
    featureFlags:
      accountProjectRole.project.workspace.workspaceFeatureFlags.map(
        (f) => f.featureFlag.flag
      ),
  };

  if (!accountInfo) {
    throw new AuthenticationError();
  }

  await redisClient.set(
    userInfo.accountId,
    JSON.stringify(accountInfo),
    'EX',
    CACHE_EXPIRE
  );

  return {
    accountUid: userInfo.accountId,
    workspaceIds: userInfo.workspaceIds,
    projectId,
    accountId,
    role: accountProjectRole.role.title,
    workspaceId: accountProjectRole.project.workspace.id,
    permissions,
  };
}
export async function verifyLocalAuthentication({
  token,
  projectId,
}: ValidateLocalAuthenticationParams): Promise<AccountInfo> {
  const { isValid, userInfo } = jwtVerify(token);

  if (!isValid || !userInfo) {
    throw new AuthenticationError();
  }

  const cacheAccountInfo = await redisClient.get(userInfo.accountId);

  if (cacheAccountInfo) {
    const accountInfo = JSON.parse(cacheAccountInfo) as AccountInfo;

    if (
      (!accountInfo.projectId && projectId) ||
      accountInfo.projectId !== projectId
    ) {
      return getAccountInfo(userInfo, projectId as number);
    }
  }

  return getAccountInfo(userInfo, projectId as number);
}
