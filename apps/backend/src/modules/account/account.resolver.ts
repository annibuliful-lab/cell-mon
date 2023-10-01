import { AppContext } from '../../@types/context';
import { Resolvers } from '../../codegen-generated';

export const mutation: Resolvers<AppContext>['Mutation'] = {
  createAccount: (_, { input }, ctx) => {
    return ctx.accountService.create(input) as never;
  },
  updateAccount: (_, { id, input }, ctx) => {
    return ctx.accountService.update(id, input);
  },
};

export const query: Resolvers<AppContext>['Query'] = {
  me: (_, _input, ctx) => {
    return ctx.accountService.findById(ctx.accountId) as never;
  },
};
