import { AppContext } from '../../@types/context';
import { Resolvers, Workspace } from '../../codegen-generated';

export const mutationResolver: Resolvers<AppContext>['Mutation'] = {
  createWorkspace: (_, { input }, ctx) => {
    return ctx.workspaceService.create(input) as never;
  },
  updateWorkspace: (_, { id, input }, ctx) => {
    return ctx.workspaceService.update(id, input) as never;
  },
};

export const queryResolver: Resolvers<AppContext>['Query'] = {
  getWorkspaceById: (_, { id }, ctx) => {
    return ctx.workspaceService.findById(id) as unknown as Promise<Workspace>;
  },
  getWorkspaces: (_, filter, ctx) => {
    return ctx.workspaceService.findManyByAccountId({
      ...filter,
      accountId: Number(ctx.accountId),
    }) as unknown as Promise<Workspace[]>;
  },
};
