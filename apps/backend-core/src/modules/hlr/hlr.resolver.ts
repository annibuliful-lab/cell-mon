import { GraphqlContext } from '@cell-mon/graphql';

import { Resolvers } from '../../codegen-generated';

export const mutation: Resolvers<GraphqlContext>['Mutation'] = {
  callHlr: (_, input, ctx) => {
    return {
      dialogId: '',
    };
  },
};
