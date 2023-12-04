import { redisClient } from '@cell-mon/db';
import { ForbiddenError, graphqlLogger, verifyApiKey } from '@cell-mon/graphql';
import { logger } from '@cell-mon/utils';
import { config } from 'dotenv';
import fastify from 'fastify';
import mercurius from 'mercurius';

import { AppContext } from './@types/context';
import { HUNTER_CACHE_SESSION_KEY } from './constants';
import schema from './graphql';
import { HrlService } from './modules/hlr/hlr.service';
import {
  healthCheckCookieTimeout,
  hlrWSConnect,
} from './modules/hlr/hlr-websocket.client';
import { JobService } from './modules/job/job.service';

config();

export async function main() {
  const host = '0.0.0.0';
  const port = 3031;
  const server = fastify();

  await server.register(mercurius, {
    schema,
    graphiql: true,
    ide: true,
    path: '/graphql',
    context: async (request): Promise<AppContext> => {
      const apiKey = request.headers['x-api-key'] as string;
      if (!apiKey) {
        throw new ForbiddenError('you do not allow with API key');
      }

      const verified = await verifyApiKey({ apiKey });

      return {
        apiKey,
        workspaceId: verified.workspaceId,
        hlrService: new HrlService(),
        jobService: new JobService({
          apiKey,
          workspaceId: verified.workspaceId,
        }),
      };
    },
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

    const hlr = new HrlService();
    await redisClient.del(HUNTER_CACHE_SESSION_KEY);
    await hlr.loginSession();
    await healthCheckCookieTimeout(6000);
    await hlrWSConnect();

    logger.info(`[ backend-core ready ] http://${host}:${port}`);
  });
}
