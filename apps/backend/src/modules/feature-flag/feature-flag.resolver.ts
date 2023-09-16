import { AppContext } from '../../@types/context';
import { FeatureFlag, Resolvers } from '../../codegen-generated';

export const mutationResolver: Resolvers<AppContext>['Mutation'] = {
  createFeatureFlag: (_, { flag }, ctx) => {
    return ctx.featureFlagService.create(flag) as Promise<FeatureFlag>;
  },
  deleteFeatureFlag: async (_, { flag }, ctx) => {
    await ctx.featureFlagService.delete(flag);
    return {
      success: true,
    };
  },
  createWorkspaceFeatureFlag: (_, input, ctx) => {
    return ctx.workspaceFeatureflagService.create(input) as never;
  },
  deleteWorkspaceFeatureFlag: async (_, input, ctx) => {
    await ctx.workspaceFeatureflagService.delete(input);

    return {
      success: true,
    };
  },
};

export const queryResolver: Resolvers<AppContext>['Query'] = {
  getFeatureFlags: (_, _input, ctx) => {
    return ctx.featureFlagService.findMany();
  },
  getWorkspaceFeatureFlags: (_, input, ctx) => {
    return ctx.workspaceFeatureflagService.findMany(input) as never;
  },
};
