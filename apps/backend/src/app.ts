import { primaryDbClient, prismaDbClient, redisClient } from '@cell-mon/db';
import { graphqlLogger } from '@cell-mon/graphql';
import { logger } from '@cell-mon/utils';
import cookie from '@fastify/cookie';
import csrfProtection from '@fastify/csrf-protection';
import helmet from '@fastify/helmet';
import multipart from '@fastify/multipart';
import { config } from 'dotenv';
import fastify from 'fastify';
import mercurius from 'mercurius';
import mercuriusGQLUpload from 'mercurius-upload';

import schema from './graphql';
import { graphqlContext } from './graphql/context';
import { hidePoweredBy } from './hooks/hide-powered-by';
import { uploadFileController } from './upload-file';

config();

export async function main() {
  const host = process.env.HOST ?? '0.0.0.0';
  const port = process.env.PORT ? Number(process.env.PORT) : 3000;

  const server = fastify();

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
    ide: false,
    path: '/graphql',
    schema,
    errorFormatter(execution) {
      logger.error(execution);
      return {
        statusCode: 200,
        response: execution,
      };
    },
    context: graphqlContext,
  });

  server.graphql.addHook('preExecution', graphqlLogger);

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
