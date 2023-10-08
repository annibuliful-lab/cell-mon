import { AppContext } from '../../@types/context';
import { Resolvers } from '../../codegen-generated';

export const mutation: Resolvers<AppContext>['Mutation'] = {
  createTargetEvidence: (_, input, ctx) => {
    return ctx.targetEvidenceService.create(input) as never;
  },
  updateTargetEvidence: (_, input, ctx) => {
    return ctx.targetEvidenceService.update(input) as never;
  },
  deleteTargetEvidence: async (_, input, ctx) => {
    await ctx.targetEvidenceService.delete(input.id);

    return {
      success: true,
    };
  },
};

export const query: Resolvers<AppContext>['Query'] = {
  getTargetEvidenceById: (_, input, ctx) => {
    return ctx.targetEvidenceService.findById(input.id) as never;
  },
  getTargetEvidenceByTargetId: (_, input, ctx) => {
    return ctx.targetEvidenceService.findManyByTargetId(input) as never;
  },
};
