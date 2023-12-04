import { graphqlLogger } from '@cell-mon/graphql';
import { logger } from '@cell-mon/utils';
import { config } from 'dotenv';
import fastify from 'fastify';
import mercurius from 'mercurius';

import schema from './graphql';
import { redisClient } from '@cell-mon/db';
import { HUNTER_CACHE_SESSION_KEY } from './constants';
import {
  healthCheckCookieTimeout,
  hlrWSConnect,
} from './modules/hlr/hlr-websocket.client';

config();

export async function main() {
  const host = '0.0.0.0';
  const port = 3001;
  const server = fastify();

  await server.register(mercurius, {
    schema,
    graphiql: true,
    ide: true,
    path: '/graphql',
  });

  server.graphql.addHook('preExecution', graphqlLogger('backend-core'));

  server.get('/health', (_req, res) => {
    res.status(200).send({
      message: 'Running',
    });
  });

  async function gracefulShutdown() {
    await server.close();
    process.exit(1);
  }

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);

  server.listen({ port, host }, async (err) => {
    if (err) {
      logger.error(err);
      process.exit(1);
    }

    await redisClient.del(HUNTER_CACHE_SESSION_KEY);
    await healthCheckCookieTimeout(6000);
    await hlrWSConnect();

    logger.info(`[ backend-core ready ] http://${host}:${port}`);
  });
}
