import { BadRequest } from '@cell-mon/graphql';
import { isValidIMSI } from '@cell-mon/utils';

import { AppContext } from '../../@types/context';
import { Resolvers } from '../../codegen-generated';

export const mutation: Resolvers<AppContext>['Mutation'] = {
  createPhoneMetadata: (_, input, ctx) => {
    if (input.imsi && !isValidIMSI(input.imsi)) {
      throw new BadRequest(['imsi']);
    }

    return ctx.phoneMetadataService.create(input);
  },
  updatePhoneMetadata: (_, input, ctx) => {
    if (input.imsi && !isValidIMSI(input.imsi)) {
      throw new BadRequest(['imsi']);
    }
    return ctx.phoneMetadataService.update(input);
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
