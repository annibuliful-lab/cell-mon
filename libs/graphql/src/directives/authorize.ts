import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils';
import { defaultFieldResolver, GraphQLSchema } from 'graphql';

import { IGraphqlContext } from '../constants/context';
import { AuthenticationError } from '../errors/authentication';

export function authorizeDirective() {
  const directiveName = 'authorize';

  return {
    authorizedDirectiveTypeDefs: `
      directive @${directiveName} on FIELD_DEFINITION
      `,
    authorizedDirectiveValidator: (schema: GraphQLSchema) =>
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

          const { resolve = defaultFieldResolver } = fieldConfig;
          fieldConfig.resolve = function (
            source,
            args,
            context: IGraphqlContext,
            info
          ) {
            if (!context.accountId) {
              throw new AuthenticationError('Unauthorization');
            }

            if (context.authProvider && !context.accessToken) {
              throw new AuthenticationError('Unauthorization');
            }

            return resolve(source, args, context, info);
          };

          return fieldConfig;
        },
      }),
  };
}
