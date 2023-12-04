export {
  getAdminApiKeyClient,
  getAdminClient,
  getUserBClient,
  getUserClient,
  testClient,
} from '../../graphql-client/src/clients/primary.client';
export { createClient as createCoreClient } from './generated/core';
export { Client, createClient } from './generated/primary';
