import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils';
import { primaryDbClient } from '@tadchud-erp/db';
import { defaultFieldResolver, GraphQLSchema } from 'graphql';

import { IGraphqlContext } from '../constants/context';
import { BadRequest } from '../errors/bad-request';
import { ForbiddenError } from '../errors/forbidden';

export type IAuthorizeMessagrGroupDirective = {
  canBeOwner: boolean;
  canBeAdmin: boolean;
};

export function authorizeMessageGroupDirective() {
  const directiveName = 'authorizeMessageGroup';

  return {
    authorizeMessageGroupDirectiveTypeDefs: `
      directive @${directiveName}(
        canBeOwner: Boolean = false
        canBeAdmin: Boolean = false
      ) on FIELD_DEFINITION | ARGUMENT_DEFINITION
      `,
    authorizeMessageGroupDirectiveValidator: (schema: GraphQLSchema) =>
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

          const authorizedOwner = accessDirective['canBeOwner'] as boolean;
          const authorizedAdmin = accessDirective['canBeAdmin'] as boolean;

          const { resolve = defaultFieldResolver } = fieldConfig;
          fieldConfig.resolve = async function (
            source,
            args: { messageGroupId?: string; id?: string },
            context: IGraphqlContext,
            info
          ) {
            if (!args?.id && !args?.messageGroupId) {
              throw new BadRequest(['message group id']);
            }

            const groupMember = await primaryDbClient
              .selectFrom('message_group_member')
              .select(['messageGroupId'])
              .where('accountId', '=', Number(context.accountId))
              .where(
                'messageGroupId',
                '=',
                Number(args?.messageGroupId ?? args?.id)
              )
              .$if(authorizedAdmin && authorizedOwner, (qb) =>
                qb.where(({ or, cmpr }) =>
                  or([cmpr('role', '=', 'OWNER'), cmpr('role', '=', 'ADMIN')])
                )
              )
              .$if(authorizedAdmin && !authorizedOwner, (qb) =>
                qb.where('role', '=', 'ADMIN')
              )
              .$if(authorizedOwner && !authorizedOwner, (qb) =>
                qb.where('role', '=', 'OWNER')
              )
              .executeTakeFirst();

            if (!groupMember) {
              throw new ForbiddenError(
                'You are not allowed to access this message group'
              );
            }

            return resolve(source, args, context, info);
          };

          return fieldConfig;
        },
      }),
  };
}
