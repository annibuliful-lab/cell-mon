import { AppContext } from '../../@types/context';
import { Resolvers } from '../../codegen-generated';

export const mutationResolver: Resolvers<AppContext>['Mutation'] = {
  createAccount: (_, { input }, ctx) => {
    return ctx.accountService.create(input);
  },
  updateAccount: (_, { id, input }, ctx) => {
    return ctx.accountService.update(id, input);
  },
};

export const queryResolver: Resolvers<AppContext>['Query'] = {
  me: (_, _input, ctx) => {
    return ctx.accountService.findById(ctx.accountId);
  },
};
