import { AppContext } from '../../@types/context';
import { Project, Resolvers } from '../../codegen-generated';

export const mutationResolver: Resolvers<AppContext>['Mutation'] = {
  createProject: (_, { input }, ctx) => {
    return ctx.projectService.create(input) as unknown as Promise<Project>;
  },
  updateProject: (_, { id, input }, ctx) => {
    return ctx.projectService.update(
      Number(id),
      input
    ) as unknown as Promise<Project>;
  },
  deleteProject: async (_, { id }, ctx) => {
    await ctx.projectService.delete(Number(id));

    return {
      success: true,
    };
  },
};

export const queryResolver: Resolvers<AppContext>['Query'] = {
  getProjectById: (_, { id }, ctx) => {
    return ctx.projectService.findById(
      Number(id)
    ) as unknown as Promise<Project>;
  },
  getProjects: (_, { filter }, ctx) => {
    return ctx.projectService.findMany(filter) as unknown as Promise<Project>[];
  },
};
