import { Permission } from '@prisma/client';

export interface GraphqlContext {
  workspaceId?: string;
  accountId: string;

  permissions: Pick<Permission, 'action' | 'subject'>[];
  role: string;
  projectFeatureFlags: string[];
  accessToken: string;
  authProvider: string;
  authorization: string;
}

export const MOCK_GRAPHQL_CONTEXT: GraphqlContext = {
  workspaceId: 'MOCK_WORKSPACE_ID',
  accountId: 'MOCK_USER_ID',
  permissions: [],
  role: 'MOCK_ROLE',
  projectFeatureFlags: [],
  accessToken: 'MOCK_ACCESS_TOKEN',
  authProvider: 'JWT',
  authorization: 'MOCK_AUTHORIZATION',
};
