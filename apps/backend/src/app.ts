import { primaryDbClient, prismaDbClient, redisClient } from '@cell-mon/db';
import { graphqlLogger } from '@cell-mon/graphql';
import { logger } from '@cell-mon/utils';
import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import csrfProtection from '@fastify/csrf-protection';
import helmet from '@fastify/helmet';
import multipart from '@fastify/multipart';
import { config } from 'dotenv';
import fastify from 'fastify';
import mercurius from 'mercurius';
import mercuriusGQLUpload from 'mercurius-upload';

import schema from './graphql';
import { graphqlContext } from './graphql/context';
import { subscriptionResolver } from './graphql/subscription';
import { hidePoweredBy } from './hooks/hide-powered-by';
import { uploadFileController } from './upload-file';
config();

export async function main() {
  const host = process.env.HOST ?? '0.0.0.0';
  const port = process.env.PORT ? Number(process.env.PORT) : 3000;

  const server = fastify();
  server.register(cors, { origin: '*' });
  server.register(multipart);
  server.register(helmet);
  server.register(hidePoweredBy, { setTo: 'PHP/7.0.33' });
  server.register(cookie, { secret: process.env.COOKIE_SECRET });
  server.register(csrfProtection, {
    csrfOpts: {
      hmacKey: process.env.HMAC_KEY as string,
    },
    cookieOpts: { signed: true, sameSite: true, secure: 'auto' },
    sessionPlugin: '@fastify/cookie',
  });
  server.register(mercuriusGQLUpload);

  uploadFileController(server);

  await server.register(mercurius, {
    graphiql: true,
    ide: true,
    path: '/graphql',
    schema,
    subscription: subscriptionResolver,
    errorFormatter(execution) {
      logger.error({
        ...execution,
        service: 'Backend',
      });

      return {
        statusCode: (execution.errors[0].extensions as Record<string, number>)
          .statusCode,
        response: execution,
      };
    },
    context: graphqlContext,
  });

  server.graphql.addHook('preExecution', graphqlLogger);

  server.graphql.addHook(
    'preSubscriptionExecution',
    (_schema, _source, context) => {
      const websocketPayload = (
        context as unknown as {
          payload: {
            authorization: string;
            workspaceId: string;
          };
        }
      )?.payload;

      const websocketType = (context as unknown as { type: 'connection_init' })
        ?.type;

      if (websocketType !== 'connection_init') {
        return;
      }

      context.app.decorateRequest(
        'authorization',
        websocketPayload.authorization,
      );
      context.app.decorateRequest('workspaceId', websocketPayload.workspaceId);
    },
  );
  async function gracefulShutdown() {
    await server.close();
    redisClient.disconnect();
    await prismaDbClient.$disconnect();
    await primaryDbClient.destroy();
    process.exit(1);
  }

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);

  server.listen({ port, host }, (err) => {
    if (err) {
      logger.error(err);
      process.exit(1);
    }

    logger.info(`[ ready ] http://${host}:${port}`);
  });
}
