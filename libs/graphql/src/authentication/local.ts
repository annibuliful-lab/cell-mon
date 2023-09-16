import { prismaDbClient, redisClient } from '@cell-mon/db';
import { IJwtAuthInfo, jwtVerify } from '@cell-mon/utils';
import { Permission } from '@prisma/client';

import { AuthenticationError } from '../errors/authentication';

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
  projectId?: string;
};

async function getAccountInfo(userInfo: IJwtAuthInfo, projectId?: string) {
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

  if (!projectId) {
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

  // const accountProjectRole = await prismaDbClient.projectAccount.findFirst({
  //   select: {
  //     project: {
  //       select: {
  //         workspace: {
  //           select: {
  //             id: true,
  //             workspaceFeatureFlags: {
  //               select: {
  //                 featureFlag: {
  //                   select: {
  //                     flag: true,
  //                   },
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       },
  //     },
  //     role: {
  //       select: {
  //         title: true,
  //         rolePermissions: {
  //           select: {
  //             permissionAbility: {
  //               select: {
  //                 action: true,
  //                 subject: true,
  //               },
  //             },
  //           },
  //         },
  //       },
  //     },
  //   },
  //   where: {
  //     accountId,
  //     projectId,
  //   },
  // });

  // if (!accountProjectRole) {
  //   throw new ForbiddenError('You are not in this project');
  // }

  // const permissions = accountProjectRole.role.rolePermissions.map((p) => ({
  //   action: p.permissionAbility.action,
  //   subject: p.permissionAbility.subject,
  // }));

  const accountInfo: AccountInfo = {
    accountUid: userInfo.accountId,
    workspaceIds: userInfo.workspaceIds,
    accountId,
    role: '',
    permissions: [],
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
    role: '',
    workspaceId: '',
    permissions: [],
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
      return getAccountInfo(userInfo, projectId);
    }
  }

  return getAccountInfo(userInfo, projectId);
}
