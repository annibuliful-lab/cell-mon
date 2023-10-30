import { parseAsync } from 'valibot';

import { AppContext } from '../../@types/context';
import { Resolvers } from '../../codegen-generated';
import { loginSchema } from './account.validation';

export const mutation: Resolvers<AppContext>['Mutation'] = {
  login: async (_, { input }, ctx) => {
    await parseAsync(loginSchema, input);

    return ctx.authenticationService.login(input);
  },
  refreshToken: (_parent, _, ctx) => {
    return ctx.authenticationService.refreshToken(ctx.accessToken);
  },
  logout: async (_parent, _, ctx) => {
    await ctx.authenticationService.logout(ctx.accessToken);

    return {
      token: ctx.accessToken,
      invokeDateTime: new Date().toUTCString(),
    };
  },
};
