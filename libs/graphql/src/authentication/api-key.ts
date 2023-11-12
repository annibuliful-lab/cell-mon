import { prismaDbClient } from '@cell-mon/db';

import { ForbiddenError } from '../errors/forbidden';

type VerifyApiKeyPayload = {
  apiKey: string;
};
export async function verifyApiKey({ apiKey }: VerifyApiKeyPayload) {
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

  return {
    apiKey,
    workspaceId: workspace.workspaceId,
  };
}
