import { config } from 'dotenv';
import { fetch } from 'undici';

import { createClient } from '../generated/primary';

config();

export const testClient = createClient({
  url: process.env.GRAPHQL_ENDPOINT,
  fetch,
});

export async function getUserClient() {
  const response = await testClient.mutation({
    login: {
      __scalar: true,
      __args: {
        input: {
          username: 'MOCK_USER_A',
          password: '12345678',
        },
      },
    },
  });

  return createClient({
    url: process.env.GRAPHQL_ENDPOINT,
    fetch,
    headers: {
      authorization: response.login.token,
    },
  });
}

export async function getUserBClient() {
  const response = await testClient.mutation({
    login: {
      __scalar: true,
      __args: {
        input: {
          username: 'MOCK_USER_B',
          password: '12345678',
        },
      },
    },
  });

  return createClient({
    url: process.env.GRAPHQL_ENDPOINT,
    fetch,
    headers: {
      authorization: response.login.token,
    },
  });
}

export async function getAdminClient() {
  const response = await testClient.mutation({
    login: {
      __scalar: true,
      __args: {
        input: {
          username: 'MOCK_ADMIN_A',
          password: '12345678',
        },
      },
    },
  });

  return createClient({
    url: process.env.GRAPHQL_ENDPOINT,
    fetch,
    headers: {
      authorization: response.login.token,
      'x-project-id': '1',
      'x-workspace-id': 'd1cd8256-696e-41fa-bb7b-306d2f2a216e',
      'x-api-key': 'ADMIN_WORKSPACE_API_KEY',
    },
  });
}
