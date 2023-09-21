import { AppContext } from '../../@types/context';
import { Resolvers } from '../../codegen-generated';

export const mutationResolver: Resolvers<AppContext>['Mutation'] = {
  createPhoneMetadata: (_, input, ctx) => {
    return ctx.phoneMetadataService.create(input);
  },
  updatePhoneMetadata: (_, input, ctx) => {
    return ctx.phoneMetadataService.update(input);
  },
};

export const queryResolver: Resolvers<AppContext>['Query'] = {
  getPhoneById: (_, input, ctx) => {
    return ctx.phoneMetadataService.findById(input.id);
  },
  getPhones: (_, input, ctx) => {
    return ctx.phoneMetadataService.findMany(input);
  },
};
