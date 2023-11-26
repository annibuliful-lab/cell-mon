import { AppContext } from '../../@types/context';
import { Resolvers, Workspace } from '../../codegen-generated';

export const mutation: Resolvers<AppContext>['Mutation'] = {
  createWorkspace: (_, { input }, ctx) => {
    return ctx.workspaceService.create(input) as never;
  },
  updateWorkspace: (_, { id, input }, ctx) => {
    return ctx.workspaceService.update(id, input) as never;
  },
  createWorkspaceRole: (_, input, ctx) => {
    return ctx.workspaceRoleService.create(input);
  },
};

export const query: Resolvers<AppContext>['Query'] = {
  getWorkspaceById: (_, { id }, ctx) => {
    return ctx.workspaceService.findById(id) as unknown as Promise<Workspace>;
  },
  getWorkspaces: (_, filter, ctx) => {
    return ctx.workspaceService.findMany({
      ...filter,
      accountId: ctx.accountId,
    }) as unknown as Promise<Workspace[]>;
  },
};

export const fields: Resolvers<AppContext> = {
  Workspace: {
    roles: (parent, _, ctx) => {
      return ctx.workspaceRoleService.dataloader.load(parent.id);
    },
  },
};
