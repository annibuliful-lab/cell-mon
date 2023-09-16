import { AppContext } from '../../@types/context';
import { Resolvers, Workspace } from '../../codegen-generated';

export const mutationResolver: Resolvers<AppContext>['Mutation'] = {
  createWorkspace: (_, { input }, ctx) => {
    return ctx.workspaceService.create(input) as Promise<Workspace>;
  },
  updateWorkspace: (_, { id, input }, ctx) => {
    return ctx.workspaceService.update(Number(id), input) as Promise<Workspace>;
  },
};

export const queryResolver: Resolvers<AppContext>['Query'] = {
  getWorkspaceById: (_, { id }, ctx) => {
    return ctx.workspaceService.findById(
      Number(id)
    ) as unknown as Promise<Workspace>;
  },
  getWorkspaces: (_, filter, ctx) => {
    return ctx.workspaceService.findManyByAccountId({
      ...filter,
      accountId: Number(ctx.accountId),
    }) as unknown as Promise<Workspace[]>;
  },
};
