import { logger } from '@cell-mon/utils';
import { DocumentNode, GraphQLSchema } from 'graphql';
import { MercuriusContext } from 'mercurius';

type MercuriusLoggingOptions = {
  logLevel?: string;
  prependAlias?: boolean;
  logBody?: boolean | ((context: MercuriusContext) => boolean);
  logVariables?: boolean;
};

function readOperations(
  document: DocumentNode,
  operation: 'mutation' | 'query' | 'subscription',
  opts: MercuriusLoggingOptions,
) {
  return document.definitions
    .filter(
      (d) => d.kind === 'OperationDefinition' && d.operation === operation,
    )
    .flatMap(
      (d) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (d as unknown as { selectionSet: { selections: any } }).selectionSet
          .selections,
    )
    .map((selectionSet) => {
      const opName = selectionSet.name.value;

      if (opts.prependAlias && selectionSet.alias) {
        return selectionSet.alias.value + ':' + opName;
      }

      return opName;
    });
}

export function graphqlLogger(serviceName: string) {
  return function (
    _schema: GraphQLSchema,
    document: DocumentNode,
    context: MercuriusContext,
    variables: Record<string, unknown>,
  ) {
    const queryOps = readOperations(document, 'query', { prependAlias: true });
    const mutationOps = readOperations(document, 'mutation', {
      prependAlias: true,
    });
    const subscriptionOps = readOperations(document, 'subscription', {
      prependAlias: true,
    });

    logger.info({
      serviceName,
      graphql: {
        queries: queryOps.length > 0 ? queryOps : undefined,
        mutations: mutationOps.length > 0 ? mutationOps : undefined,
        subscriptionOps:
          subscriptionOps.length > 0 ? subscriptionOps : undefined,
        operationName: (context.reply.request.body as { operationName: string })
          ?.operationName,
        variables,
      },
    });
  };
}
