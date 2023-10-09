import { uniq } from 'lodash';

import { AppContext } from '../../@types/context';
import { Resolvers } from '../../codegen-generated';

export const mutation: Resolvers<AppContext>['Mutation'] = {
  assignPhoneToTarget: (_, input, ctx) => {
    return ctx.phoneTargetService.create(input) as never;
  },
  bulkAssignPhonesToTarget: (_, input, ctx) => {
    return ctx.phoneTargetService.bulkCreate(input) as never;
  },
  unassignPhoneFromTarget: async (_, input, ctx) => {
    await ctx.phoneTargetService.delete(input.id);

    return {
      success: true,
      ids: [input.id],
    };
  },
  bulkUnassignPhonesFromTarget: async (_, input, ctx) => {
    await ctx.phoneTargetService.bulkDelete(input);

    return {
      success: true,
      ids: uniq(input.ids),
    };
  },
};

export const query: Resolvers<AppContext>['Query'] = {
  getPhoneTargetById: (_, input, ctx) => {
    return ctx.phoneTargetService.findById(input.id) as never;
  },
  getPhoneTargetsByTargetId: (_, input, ctx) => {
    return ctx.phoneTargetService.findManyByTargetId(input) as never;
  },
};

export const field: Resolvers<AppContext> = {
  PhoneTarget: {
    phone: (parent, _input, ctx) => {
      return ctx.phoneMetadataService.dataloader.load(parent.phoneId);
    },
  },
};
