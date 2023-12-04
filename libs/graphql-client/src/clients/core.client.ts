import { config } from 'dotenv';
import { fetch } from 'undici';

import { createClient } from '../generated/core';

config();

export const coreClient = createClient({
  url: process.env.GRAPHQL_CORE_ENDPOINT,
  fetch,
});
