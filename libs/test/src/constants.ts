import { IGraphqlContext } from '@tadchud-erp/graphql';

export const MOCK_GRAPHQL_CONTEXT: IGraphqlContext = {
  authProvider: 'JWT',
  accessToken: 'MOCK_ACCESS_TOKEN',
  authorization: 'MOCK_AUTHORIZATION',
  accountId: 'TEST_USER',
  permissions: [],
  role: 'MOCK_ROLE',
  projectId: 'MOCK_PROJECT_ID',
  workspaceId: 1,
  projectFeatureFlags: [],
};

export const MOCK_USER_AUTHENTICATION = {
  username: 'MOCK_USER_A',
  password: '12345678',
};
