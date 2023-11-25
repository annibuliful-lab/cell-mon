import { BadRequest } from '@cell-mon/graphql';
import { extractMccMncFromImsi, isValidIMSI } from '@cell-mon/utils';

import { AppContext } from '../../@types/context';
import { Resolvers } from '../../codegen-generated';

export const mutation: Resolvers<AppContext>['Mutation'] = {
  createPhoneMetadataImsi: async (_, input, ctx) => {
    if (!isValidIMSI(input.imsi)) {
      throw new BadRequest(['imsi']);
    }

    const imsi = extractMccMncFromImsi(input.imsi);
    if (!imsi) {
      throw new BadRequest(['imsi']);
    }

    const operator = await ctx.phoneMetadataService.findPhoneOperator({
      mcc: imsi.mcc,
      mnc: imsi.mnc,
    });

    return ctx.phoneMetadataImsiService.create({
      ...input,
      operator: operator.operator,
    });
  },
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

export const fields: Resolvers<AppContext> = {
  PhoneMetadata: {
    imsi: (parent, _, ctx) => {
      if (!parent.imsiId) return;

      return ctx.phoneMetadataImsiService.dataloader.load(parent.imsiId);
    },
    msisdn: (parent, _, ctx) => {
      if (!parent.msisdnId) return;

      return ctx.phoneMetadataMsisdnService.dataloader.load(parent.msisdnId);
    },
  },
};
