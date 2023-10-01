import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils';
import { PermissionAction } from '@prisma/client';
import { defaultFieldResolver, GraphQLSchema } from 'graphql';

import { GraphqlContext } from '../constants/context';
import { AuthenticationError } from '../errors/authentication';
import { ForbiddenError } from '../errors/forbidden';
export interface IAccessDirective {
  subject: string;
  action: PermissionAction;
  requiredWorkspaceId: boolean;
  role?: string;
  validateOrganization: boolean;
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
        ) on FIELD_DEFINITION
        `,

    accessDirectiveValidator: (schema: GraphQLSchema) =>
      mapSchema(schema, {
        [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
          const accessDirective = getDirective(
            schema,
            fieldConfig,
            directiveName
          )?.[0];

          if (!accessDirective) {
            return;
          }

          const subject = accessDirective?.['subject'];

          const action = accessDirective?.['action'] as PermissionAction;

          const requiredWorkspaceId = accessDirective?.['requiredWorkspaceId'];

          const featureFlag = accessDirective?.['featureFlag'];

          const { resolve = defaultFieldResolver } = fieldConfig;
          fieldConfig.resolve = function (
            source,
            args,
            context: GraphqlContext,
            info
          ) {
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
              throw new ForbiddenError(
                `You must have feature flag: ${featureFlag}`
              );
            }

            if (
              subject &&
              action &&
              !context.permissions.some(
                (p) => p.subject === subject && p.action === action
              )
            ) {
              throw new ForbiddenError(
                `You do not allow to access this subject: ${subject}`
              );
            }

            return resolve(source, args, context, info);
          };

          return fieldConfig;
        },
      }),
  };
}
