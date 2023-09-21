import { Permission } from '@prisma/client';

export interface GraphqlContext {
  workspaceId?: string;
  accountId: string;
  projectId: string;
  permissions: Pick<Permission, 'action' | 'subject'>[];
  role: string;
  projectFeatureFlags: string[];
  accessToken: string;
  authProvider: string;
  authorization: string;
}

export const MOCK_GRAPHQL_CONTEXT: GraphqlContext = {
  workspaceId: '',
  accountId: 'MOCK_USER_ID',
  projectId: 'MOCK_PROJECT_ID',
  permissions: [],
  role: 'MOCK_ROLE',
  projectFeatureFlags: [],
  accessToken: 'MOCK_ACCESS_TOKEN',
  authProvider: 'JWT',
  authorization: 'MOCK_AUTHORIZATION',
};
