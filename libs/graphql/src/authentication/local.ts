import { PermissionAction, prismaDbClient, redisClient } from '@cell-mon/db';
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

async function getAccountInfo(
  userInfo: IJwtAuthInfo,
  workspaceId?: string,
): Promise<AccountInfo> {
  const accountId = await getAccountId(userInfo);

  if (!workspaceId) {
    const accountInfo = buildAccountInfo(userInfo, accountId);
    await updateCache(userInfo.accountId, accountInfo);
    return accountInfo;
  }

  const accountWorkspaceRole = await getAccountWorkspaceRole(
    accountId,
    workspaceId,
  );

  if (!accountWorkspaceRole) {
    throw new ForbiddenError('You are not in this project');
  }

  const permissions = buildPermissions(
    accountWorkspaceRole.role.workspaceRolePermissions,
  );

  const accountInfo = buildAccountInfoWithRole(
    userInfo,
    accountId,
    accountWorkspaceRole,
    permissions,
  );
  await updateCache(userInfo.accountId, accountInfo);

  return accountInfo;
}

async function getAccountId(userInfo: IJwtAuthInfo): Promise<string> {
  const account = await prismaDbClient.account.findUnique({
    select: { id: true },
    where: { id: userInfo.accountId },
  });

  if (!account?.id) {
    throw new AuthenticationError();
  }

  return account.id;
}

function buildAccountInfo(
  userInfo: IJwtAuthInfo,
  accountId: string,
): AccountInfo {
  return {
    accountUid: userInfo.accountId,
    workspaceIds: userInfo.workspaceIds,
    accountId,
    permissions: [],
  };
}

async function getAccountWorkspaceRole(accountId: string, workspaceId: string) {
  return prismaDbClient.workspaceAccount.findFirst({
    select: {
      workspace: { select: { id: true } },
      role: {
        select: {
          title: true,
          workspaceRolePermissions: {
            select: {
              permission: { select: { action: true, subject: true } },
            },
          },
        },
      },
    },
    where: { accountId, workspaceId },
  });
}

function buildPermissions(
  accountWorkspaceRole: {
    permission: {
      action: PermissionAction;
      subject: string;
    };
  }[],
) {
  return accountWorkspaceRole.map((p) => ({
    action: p.permission.action,
    subject: p.permission.subject,
  }));
}

function buildAccountInfoWithRole(
  userInfo: IJwtAuthInfo,
  accountId: string,
  accountWorkspaceRole: {
    role: {
      title: string;
    };
  },
  permissions: {
    action: PermissionAction;
    subject: string;
  }[],
): AccountInfo {
  return {
    accountUid: userInfo.accountId,
    workspaceIds: userInfo.workspaceIds,
    accountId,
    role: accountWorkspaceRole.role.title,
    permissions,
  };
}

async function updateCache(accountId: string, accountInfo: AccountInfo) {
  await redisClient.set(
    accountId,
    JSON.stringify(accountInfo),
    'EX',
    CACHE_EXPIRE,
  );
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
