import { AppContext } from '../../@types/context';
import { Resolvers } from '../../codegen-generated';

export const mutation: Resolvers<AppContext>['Mutation'] = {
  createPhoneTargetLocation: (_, input, ctx) => {
    return ctx.phoneTargetLocationService.create(input);
  },
};

export const query: Resolvers<AppContext>['Query'] = {
  getPhoneTargetLocationById: (_, input, ctx) => {
    return ctx.phoneTargetLocationService.findById(input.id);
  },
  getPhoneTargeLocationsByPhoneTargetId: (_, input, ctx) => {
    return ctx.phoneTargetLocationService.findManyByPhoneTargetId(input);
  },
};
