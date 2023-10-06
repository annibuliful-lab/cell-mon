import { AppContext } from '../../@types/context';
import { Resolvers } from '../../codegen-generated';

export const mutation: Resolvers<AppContext>['Mutation'] = {
  assignTargetToMission: (_, input, ctx) => {
    return ctx.missionTargetService.create(input) as never;
  },
  bulkAssignTargetsToMission: (_, input, ctx) => {
    return ctx.missionTargetService.bulkCreate(input) as never;
  },
  unassignTargetFromMission: async (_, input, ctx) => {
    await ctx.missionTargetService.delete(input.id);

    return {
      success: true,
      ids: [input.id],
    };
  },
  bulkUnassignTargetsFromMission: async (_, input, ctx) => {
    await ctx.missionTargetService.bulkDelete(input.ids);
    return {
      success: true,
      ids: input.ids,
    };
  },
};

export const query: Resolvers<AppContext>['Query'] = {
  getMissionTargetById: (_, input, ctx) => {
    return ctx.missionTargetService.findById(input.id) as never;
  },
  getMissionTargetsByMissionId: (_, input, ctx) => {
    return ctx.missionTargetService.findManyByMission(input) as never;
  },
};
