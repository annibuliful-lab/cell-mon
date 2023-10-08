import { AppContext } from '../../@types/context';
import { Resolvers } from '../../codegen-generated';

export const mutation: Resolvers<AppContext>['Mutation'] = {
  assignPhoneToTarget: (_, input, ctx) => {
    return ctx.phoneTargetService.create(input) as never;
  },
  bulkAssignPhoneToTarget: (_, input, ctx) => {
    return ctx.phoneTargetService.bulkCreate(input) as never;
  },
  unassignPhoneFromTarget: (_, input, ctx) => {
    return ctx.phoneTargetService.delete(input.id) as never;
  },
  bulkUnassignPhoneFromTarget: (_, input, ctx) => {
    return ctx.phoneTargetService.bulkDelete(input.ids) as never;
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
