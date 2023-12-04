import { AppContext } from '../../@types/context';
import { Resolvers } from '../../codegen-generated';

export const mutation: Resolvers<AppContext>['Mutation'] = {
  createJob: (_, input, ctx) => {
    return ctx.jobService.create(input);
  },
  updateJob: (_, input, ctx) => {
    return ctx.jobService.update(input);
  },
};

export const query: Resolvers<AppContext>['Query'] = {
  getJobById: (_, filter, ctx) => {
    return ctx.jobService.findById(filter.id);
  },
  getJobByReferenceId: (_, filter, ctx) => {
    return ctx.jobService.findFirstByReferenceId(filter.referenceId);
  },
};
