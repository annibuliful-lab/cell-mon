import fastifyOpentelemetry from '@autotelic/fastify-opentelemetry';
import cookie from '@fastify/cookie';
import csrfProtection from '@fastify/csrf-protection';
import helmet from '@fastify/helmet';
import multipart from '@fastify/multipart';
import { primaryDbClient, prismaDbClient, redisClient } from '@tadchud-erp/db';
import {
  graphqlLogger,
  IGraphqlContext,
  verifyLocalAuthentication,
} from '@tadchud-erp/graphql';
import { tracerProvider } from '@tadchud-erp/tracer';
import { logger } from '@tadchud-erp/utils';
import { config } from 'dotenv';
import fastify from 'fastify';
import mercurius from 'mercurius';
import mercuriusGQLUpload from 'mercurius-upload';

import type { AppContext } from './@types/context';
import schema from './graphql';
import { hidePoweredBy } from './hooks/hide-powered-by';
import { AccountService } from './modules/account/account.service';
import { AuthenticationService } from './modules/authentication/authentication.service';
import {
  FeatureFlagService,
  WorkspaceFeatureflagService,
} from './modules/feature-flag/feature-flag.service';
import { Fileservice } from './modules/file/file.service';
import { MessageGroupService } from './modules/message/message-group.service';
import { MessageGroupMemberService } from './modules/message/message-group-member.service';
import { PermissionAbilityService } from './modules/permission-ability/permission-ability.service';
import { ProjectService } from './modules/project/project.service';
import { WorkspaceService } from './modules/workspace/workspace.service';
import { uploadFileController } from './upload-file';

config();

export async function main() {
  const provider = tracerProvider('Tadchud');

  const host = process.env.HOST ?? '0.0.0.0';
  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  const server = fastify();

  server.register(multipart);
  server.register(helmet);
  server.register(hidePoweredBy, { setTo: 'PHP/7.0.33' });
  server.register(cookie, { secret: process.env.COOKIE_SECRET });
  server.register(csrfProtection, { cookieOpts: { signed: true } });
  server.register(mercuriusGQLUpload, {
    validate: false,
  });

  uploadFileController(server);
  await server.register(fastifyOpentelemetry, { wrapRoutes: true });
  await server.register(mercurius, {
    graphiql: false,
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
    context: async (
      { headers, body },
      { request: { openTelemetry } }
    ): Promise<AppContext | object> => {
      const { activeSpan, tracer } = openTelemetry();

      const allowIntrospection =
        (body as { operationName: string })?.['operationName'] ===
          'IntrospectionQuery' && !isProduction;
      const span = tracer.startSpan('compute-add');
      activeSpan?.setAttribute('body', JSON.stringify(body));

      if (allowIntrospection) {
        span.end();
        return {};
      }

      const authProvider = headers['x-auth-provider'] as string;
      const accessToken = headers['access-token'] as string;
      const authorization = headers['authorization'] as string;
      const projectId = headers['x-project-id'] as string;

      if (!authorization) {
        const context = {
          authProvider,
          accessToken,
          authorization,
          accountId: '',
          permissions: [],
          role: 'Guest',
          projectId,
          projectFeatureFlags: [],
        };
        span.end();

        return {
          authenticationService: new AuthenticationService(context),
          accountService: new AccountService(context),
        };
      }

      const { accountId, role, permissions, featureFlags, workspaceId } =
        await verifyLocalAuthentication({
          token: authorization,
          projectId: projectId ? Number(projectId) : undefined,
        });

      const context: IGraphqlContext = {
        authProvider,
        accessToken,
        authorization,
        accountId: accountId.toString(),
        permissions,
        role: role as string,
        projectId,
        projectFeatureFlags: featureFlags as string[],
        workspaceId,
      };
      span.end();

      return {
        ...context,
        workspaceService: new WorkspaceService(context),
        workspaceFeatureflagService: new WorkspaceFeatureflagService(context),
        authenticationService: new AuthenticationService(context),
        accountService: new AccountService(context),
        permissionAbilityService: new PermissionAbilityService(context),
        featureFlagService: new FeatureFlagService(context),
        fileservice: new Fileservice(context),
        projectService: new ProjectService(context),
        messageGroupService: new MessageGroupService(context),
        messageGroupMemberService: new MessageGroupMemberService(context),
      };
    },
  });

  server.graphql.addHook('preExecution', graphqlLogger);

  async function gracefulShutdown() {
    await server.close();
    redisClient.disconnect();
    await prismaDbClient.$disconnect();
    await primaryDbClient.destroy();
    await provider.shutdown();
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
