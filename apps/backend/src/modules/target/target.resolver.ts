import { AppContext } from '../../@types/context';
import { Resolvers } from '../../codegen-generated';

export const mutation: Resolvers<AppContext>['Mutation'] = {
  createTarget: (_, input, ctx) => {
    return ctx.targetService.create(input) as never;
  },
  updateTarget: (_, input, ctx) => {
    return ctx.targetService.update(input) as never;
  },
  deleteTarget: async (_, input, ctx) => {
    await ctx.targetService.delete(input.id);

    return {
      success: true,
    };
  },
};

export const query: Resolvers<AppContext>['Query'] = {
  getTargetById: (_, input, ctx) => {
    return ctx.targetService.findById(input.id) as never;
  },
  getTargets: (_, input, ctx) => {
    return ctx.targetService.findMany(input) as never;
  },
};
