import { AppContext } from '../../@types/context';
import { Resolvers } from '../../codegen-generated';

export const mutation: Resolvers<AppContext>['Mutation'] = {
  createPhoneMetadata: (_, input, ctx) => {
    return ctx.phoneMetadataService.create(input) as never;
  },
  updatePhoneMetadata: (_, input, ctx) => {
    return ctx.phoneMetadataService.update(input) as never;
  },
};

export const query: Resolvers<AppContext>['Query'] = {
  getPhoneById: (_, input, ctx) => {
    return ctx.phoneMetadataService.findById(input.id) as never;
  },
  getPhones: (_, input, ctx) => {
    return ctx.phoneMetadataService.findMany(input) as never;
  },
};
