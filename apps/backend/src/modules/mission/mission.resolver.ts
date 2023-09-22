import { AppContext } from '../../@types/context';
import { Resolvers } from '../../codegen-generated';

export const mutation: Resolvers<AppContext>['Mutation'] = {
  createMission: (_, input, ctx) => {
    return ctx.missionService.create(input) as never;
  },
};
