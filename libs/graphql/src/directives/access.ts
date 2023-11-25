import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils';
import { PermissionAction } from '@prisma/client';
import { defaultFieldResolver, GraphQLSchema } from 'graphql';

import { GraphqlContext } from '../constants/context';
import { AuthenticationError } from '../errors/authentication';
import { ForbiddenError } from '../errors/forbidden';
export interface AccessDirective {
  subject: string;
  action: PermissionAction;
  requiredWorkspaceId: boolean;
  role?: string;
  validateOrganization: boolean;
  allowExternal?: boolean;
  requiredApiKey: boolean;
  featureFlag?: string;
}

export function accessDirective() {
  const directiveName = 'access';

  return {
    accessdDirectiveTypeDefs: `

        directive @${directiveName}(
          subject: String
          action: PermissionAction
          requiredWorkspaceId: Boolean = false
          featureFlag: String
          allowExternal: Boolean = false
          requiredApiKey: Boolean = false
        ) on FIELD_DEFINITION
        `,

    accessDirectiveValidator: (schema: GraphQLSchema) =>
      mapSchema(schema, {
        [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
          const accessDirective = getDirective(
            schema,
            fieldConfig,
            directiveName,
          )?.[0] as AccessDirective;

          if (!accessDirective) {
            return;
          }

          const subject = accessDirective?.['subject'];

          const action = accessDirective?.['action'] as PermissionAction;

          const requiredWorkspaceId = accessDirective?.['requiredWorkspaceId'];

          const featureFlag = accessDirective?.['featureFlag'];

          const requiredApiKey = accessDirective?.['requiredApiKey'];

          const { resolve = defaultFieldResolver } = fieldConfig;
          fieldConfig.resolve = function (
            source,
            args,
            context: GraphqlContext,
            info,
          ) {
            if (requiredApiKey && !context.apiKey) {
              throw new ForbiddenError('You must provide api key');
            }

            if (requiredApiKey && context.apiKey) {
              return resolve(source, args, context, info);
            }

            if (!context.accountId) {
              throw new AuthenticationError();
            }

            if (requiredWorkspaceId && !context.workspaceId) {
              throw new ForbiddenError('You must provide workspace id');
            }

            if (
              featureFlag &&
              !context.projectFeatureFlags.includes(featureFlag)
            ) {
              throw new ForbiddenError('You must have feature flag');
            }

            if (
              subject &&
              action &&
              !context.permissions.some(
                (p) => p.subject === subject && p.action === action,
              )
            ) {
              throw new ForbiddenError('You do not allow to access');
            }

            return resolve(source, args, context, info);
          };

          return fieldConfig;
        },
      }),
  };
}
