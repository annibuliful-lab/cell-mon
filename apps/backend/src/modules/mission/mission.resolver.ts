import { AppContext } from '../../@types/context';
import { Resolvers } from '../../codegen-generated';

export const mutation: Resolvers<AppContext>['Mutation'] = {
  createMission: (_, input, ctx) => {
    return ctx.missionService.create(input) as never;
  },
  deleteMission: async (_, input, ctx) => {
    await ctx.missionService.delete(input.id);

    return { success: true };
  },
  updateMission: (_, input, ctx) => {
    return ctx.missionService.update(input) as never;
  },
};

export const query: Resolvers<AppContext>['Query'] = {
  getMissionById: (_, input, ctx) => {
    return ctx.missionService.findById(input.id) as never;
  },
};
