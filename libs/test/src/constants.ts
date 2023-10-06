import { GraphqlContext } from '@cell-mon/graphql';

export const MOCK_GRAPHQL_CONTEXT: GraphqlContext = {
  authProvider: 'JWT',
  accessToken: 'MOCK_ACCESS_TOKEN',
  authorization: 'MOCK_AUTHORIZATION',
  accountId: 'TEST_USER',
  permissions: [],
  role: 'MOCK_ROLE',
  workspaceId: '',
  projectFeatureFlags: [],
};

export const MOCK_USER_AUTHENTICATION = {
  username: 'MOCK_USER_A',
  password: '12345678',
};
