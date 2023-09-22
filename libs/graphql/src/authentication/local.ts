import { prismaDbClient, redisClient } from '@cell-mon/db';
import { IJwtAuthInfo, jwtVerify } from '@cell-mon/utils';
import { Permission } from '@prisma/client';

import { AuthenticationError } from '../errors/authentication';
import { ForbiddenError } from '../errors/forbidden';

const CACHE_EXPIRE = 3600;

type AccountInfo = {
  accountUid: string;
  accountId: string;
  projectId?: string;
  role?: string;
  workspaceIds: string[];
  permissions: Pick<Permission, 'action' | 'subject'>[];
  workspaceId?: string;
};

type ValidateLocalAuthenticationParams = {
  token: string;
  workspaceId?: string;
};

async function getAccountInfo(userInfo: IJwtAuthInfo, workspaceId?: string) {
  const accountId = (
    await prismaDbClient.account.findUnique({
      select: {
        id: true,
      },
      where: {
        id: userInfo.accountId,
      },
    })
  )?.id;

  if (!accountId) {
    throw new AuthenticationError();
  }

  if (!workspaceId) {
    const accountInfo: AccountInfo = {
      accountUid: userInfo.accountId,
      workspaceIds: userInfo.workspaceIds,
      accountId,
      permissions: [],
    };

    await redisClient.set(
      userInfo.accountId,
      JSON.stringify(accountInfo),
      'EX',
      CACHE_EXPIRE
    );

    return accountInfo;
  }

  const accountWorkspaceRole = await prismaDbClient.workspaceAccount.findFirst({
    select: {
      workspace: {
        select: {
          id: true,
        },
      },
      role: {
        select: {
          title: true,
          workspaceRolePermissions: {
            select: {
              permission: {
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
      workspaceId,
    },
  });

  if (!accountWorkspaceRole) {
    throw new ForbiddenError('You are not in this project');
  }

  const permissions = accountWorkspaceRole.role.workspaceRolePermissions.map(
    (p) => ({
      action: p.permission.action,
      subject: p.permission.subject,
    })
  );

  const accountInfo: AccountInfo = {
    accountUid: userInfo.accountId,
    workspaceIds: userInfo.workspaceIds,
    accountId,
    role: accountWorkspaceRole.role.title,
    permissions: permissions,
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
    accountId,
    role: '',
    workspaceId: '',
    permissions: [],
  };
}

export async function verifyLocalAuthentication({
  token,
  workspaceId,
}: ValidateLocalAuthenticationParams): Promise<AccountInfo> {
  const { isValid, userInfo } = jwtVerify(token);

  if (!isValid || !userInfo) {
    throw new AuthenticationError();
  }

  const cacheAccountInfo = await redisClient.get(userInfo.accountId);

  if (cacheAccountInfo) {
    const accountInfo = JSON.parse(cacheAccountInfo) as AccountInfo;

    if (
      (!accountInfo.workspaceId && workspaceId) ||
      accountInfo.workspaceId !== workspaceId
    ) {
      return getAccountInfo(userInfo, workspaceId);
    }
  }

  return getAccountInfo(userInfo, workspaceId);
}
