import { prismaDbClient, redisClient } from '@cell-mon/db';

import { ForbiddenError } from '../errors/forbidden';

type VerifyApiKeyPayload = {
  apiKey: string;
};

export async function verifyApiKey({ apiKey }: VerifyApiKeyPayload): Promise<{
  apiKey: string;
  workspaceId: string;
}> {
  const cache = await redisClient.get(apiKey);

  if (cache) {
    return JSON.parse(cache);
  }
  const workspace = await prismaDbClient.workspaceConfiguration.findFirst({
    select: {
      workspaceId: true,
      isActive: true,
    },
    where: {
      apiKey,
    },
  });

  if (!workspace) {
    throw new ForbiddenError('you do not allow with API key');
  }

  if (!workspace.isActive) {
    throw new ForbiddenError('you do not allow with API key');
  }

  await redisClient.set(
    apiKey,
    JSON.stringify({
      apiKey,
      workspaceId: workspace.workspaceId,
    }),
  );

  return {
    apiKey,
    workspaceId: workspace.workspaceId,
  };
}
