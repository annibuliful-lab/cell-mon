import { PermissionAbility } from 'kysely-codegen';

export interface IGraphqlContext {
  workspaceId?: number;
  accountId: string;
  projectId: string;
  permissions: Pick<PermissionAbility, 'action' | 'subject'>[];
  role: string;
  projectFeatureFlags: string[];
  accessToken: string;
  authProvider: string;
  authorization: string;
}

export const MOCK_GRAPHQL_CONTEXT: IGraphqlContext = {
  workspaceId: -1,
  accountId: 'MOCK_USER_ID',
  projectId: 'MOCK_PROJECT_ID',
  permissions: [],
  role: 'MOCK_ROLE',
  projectFeatureFlags: [],
  accessToken: 'MOCK_ACCESS_TOKEN',
  authProvider: 'JWT',
  authorization: 'MOCK_AUTHORIZATION',
};
