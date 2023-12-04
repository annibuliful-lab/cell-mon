import { primaryDbClient, redisClient } from '@cell-mon/db';
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
  apiKey: string | null;
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

  const workspaceConfiguration = await primaryDbClient
    .selectFrom('workspace_configuration')
    .select(['apiKey', 'isActive'])
    .where('workspaceId', '=', workspaceId)
    .executeTakeFirst();

  if (!accountWorkspaceRole) {
    throw new ForbiddenError('You are not allow in this project');
  }

  const accountInfo = {
    accountUid: userInfo.accountId,
    workspaceIds: userInfo.workspaceIds,
    accountId,
    role: accountWorkspaceRole.role.title,
    permissions: accountWorkspaceRole.role.workspaceRolePermissions,
    apiKey: workspaceConfiguration?.apiKey ?? null,
  };

  await updateCache(userInfo.accountId, accountInfo);

  return accountInfo;
}

async function getAccountId(userInfo: IJwtAuthInfo): Promise<string> {
  const account = await primaryDbClient
    .selectFrom('account')
    .select(['id'])
    .where('id', '=', userInfo.accountId)
    .executeTakeFirst();

  if (!account) {
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
    apiKey: null,
  };
}

async function getAccountWorkspaceRole(accountId: string, workspaceId: string) {
  const workspaceAccount = await primaryDbClient
    .selectFrom('workspace_account')
    .select('roleId')
    .where('accountId', '=', accountId)
    .where('workspaceId', '=', workspaceId)
    .executeTakeFirst();

  if (!workspaceAccount) {
    throw new AuthenticationError();
  }

  const role = await primaryDbClient
    .selectFrom('workspace_role')
    .select(['id', 'title'])
    .where('id', '=', workspaceAccount.roleId)
    .executeTakeFirst();

  if (!role) {
    throw new AuthenticationError();
  }

  const workspaceRolePermissions = await primaryDbClient
    .selectFrom('workspace_role_permission')
    .innerJoin(
      'permission',
      'permission.id',
      'workspace_role_permission.permissionId',
    )
    .select(['permission.action as action', 'permission.subject as subject'])
    .where('roleId', '=', role.id)
    .execute();

  return {
    workspace: {
      id: workspaceId,
    },
    account: {
      id: accountId,
    },
    role: {
      title: role.title,
      workspaceRolePermissions,
    },
  };
}

function updateCache(accountId: string, accountInfo: AccountInfo) {
  return redisClient.set(
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
