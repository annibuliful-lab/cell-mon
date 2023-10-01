import { AppContext } from '../../@types/context';
import { PermissionAbility, Resolvers } from '../../codegen-generated';

export const mutation: Resolvers<AppContext>['Mutation'] = {
  createPermissionAbility: async (_, { input }, ctx) => {
    return ctx.permissionAbilityService.create(
      input
    ) as Promise<PermissionAbility>;
  },
  updatePermissionAbility: async (_, { id, input }, ctx) => {
    return ctx.permissionAbilityService.update(
      id,
      input
    ) as Promise<PermissionAbility>;
  },
  deletePermissionAbility: async (_, { id }, ctx) => {
    await ctx.permissionAbilityService.delete(id);

    return {
      success: true,
    };
  },
};

export const query: Resolvers<AppContext>['Query'] = {
  getPermissionAbilities: async (_, { filter }, ctx) => {
    return ctx.permissionAbilityService.findMany(filter) as Promise<
      PermissionAbility[]
    >;
  },
};
