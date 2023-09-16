import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils';
import { PermissionAction } from '@prisma/client';
import { defaultFieldResolver, GraphQLSchema } from 'graphql';

import { IGraphqlContext } from '../constants/context';
import { AuthenticationError } from '../errors/authentication';
import { ForbiddenError } from '../errors/forbidden';
export interface IAccessDirective {
  subject: string;
  action: PermissionAction;
  requiredWorkspaceId: boolean;
  requiredProjectId: boolean;
  role?: string;
  validateOrganization: boolean;
  featureFlag?: string;
}

export function accessDirective() {
  const directiveName = 'access';

  return {
    accessdDirectiveTypeDefs: `
        input AccessDirectiveInput {
          subject: String
          action: PermissionAction
          requiredProjectId: Boolean = false
          requiredWorkspaceId: Boolean = false
          role: String
          featureFlag: String
        }

        directive @${directiveName}(conditions: AccessDirectiveInput!) on FIELD_DEFINITION
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

          const accessDirectiveCondition = accessDirective[
            'conditions'
          ] as IAccessDirective;

          const subject = accessDirectiveCondition?.['subject'];

          const action = accessDirectiveCondition?.[
            'action'
          ] as PermissionAction;

          const role = accessDirectiveCondition?.['role'];

          const requiredProjectId =
            accessDirectiveCondition?.['requiredProjectId'];

          const requiredWorkspaceId =
            accessDirectiveCondition?.['requiredWorkspaceId'];

          const featureFlag = accessDirectiveCondition?.['featureFlag'];

          const { resolve = defaultFieldResolver } = fieldConfig;
          fieldConfig.resolve = function (
            source,
            args,
            context: IGraphqlContext,
            info
          ) {
            if (requiredWorkspaceId && !context.workspaceId) {
              throw new ForbiddenError('You must provide workspace id');
            }

            if (!context.accountId) {
              throw new AuthenticationError('Unauthorization');
            }

            if (
              featureFlag &&
              !context.projectFeatureFlags.includes(featureFlag)
            ) {
              throw new ForbiddenError(
                `You must have feature flag: ${featureFlag}`
              );
            }

            if (requiredProjectId && !context.projectId) {
              throw new ForbiddenError('Project id is required');
            }

            if (role && context.role !== role) {
              throw new ForbiddenError(`You must have role: ${role}`);
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
