import { AppContext } from '../../@types/context';
import { Resolvers } from '../../codegen-generated';

export const mutationResolver: Resolvers<AppContext>['Mutation'] = {
  createMessageGroup: (_, { input }, ctx) => {
    return ctx.messageGroupService.create(input) as never;
  },
  updateMessageGroup: (_, input, ctx) => {
    return ctx.messageGroupService.update(input) as never;
  },
  deleteMessageGroup: async (_, { id }, ctx) => {
    await ctx.messageGroupService.delete(Number(id));

    return {
      success: true,
    };
  },
  createMessageGroupMember: (_, { input }, ctx) => {
    return ctx.messageGroupMemberService.create(input) as never;
  },
  deleteMessageGroupMember: async (_, { input }, ctx) => {
    await ctx.messageGroupMemberService.delete(input);

    return {
      success: true,
    };
  },
};

export const queryResolver: Resolvers<AppContext>['Query'] = {
  findMessageGroupById: (_, { id }, ctx) => {
    return ctx.messageGroupService.findById(Number(id)) as never;
  },
  findMessageGroups: (_, { filter }, ctx) => {
    return ctx.messageGroupService.findMany(filter) as never;
  },
  findMessageGroupMemebers: (_, { filter }, ctx) => {
    return ctx.messageGroupMemberService.findMany(filter) as never;
  },
};
