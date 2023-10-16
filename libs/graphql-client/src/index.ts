export {
  getAdminClient,
  getUserBClient,
  getUserClient,
  testClient,
} from '../../graphql-client/src/clients/primary.client';
export { client as apolloClient } from './clients/apollo.client';
export { Client } from './generated/primary';
export { useLoginMutation } from './graphql/generated/graphql';
