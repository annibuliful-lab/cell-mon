import { parseAsync } from 'valibot';

import { AppContext } from '../../@types/context';
import { Resolvers } from '../../codegen-generated';
import { createAccountSchema, updateAccountSchema } from './account.validation';

export const mutation: Resolvers<AppContext>['Mutation'] = {
  createAccount: async (_, { input }, ctx) => {
    await parseAsync(createAccountSchema, input);

    return ctx.accountService.create(input) as never;
  },
  updateAccount: async (_, { id, input }, ctx) => {
    await parseAsync(updateAccountSchema, input);

    return ctx.accountService.update(id, input);
  },
};

export const query: Resolvers<AppContext>['Query'] = {
  me: (_, _input, ctx) => {
    return ctx.accountService.findById(ctx.accountId) as never;
  },
};
