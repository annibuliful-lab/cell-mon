import { AppContext } from '../../@types/context';
import { Resolvers } from '../../codegen-generated';

export const mutation: Resolvers<AppContext>['Mutation'] = {
  login: (_, { input }, ctx) => {
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
