import { AppContext } from '../../@types/context';
import { EvidencePhoto, Resolvers } from '../../codegen-generated';

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

export const field: Resolvers<AppContext> = {
  TargetEvidence: {
    evidence: async (parent, _, ctx) => {
      if (!parent.evidence) return;
      const photos: EvidencePhoto[] = [];

      for (const photo of parent.evidence.photos ?? []) {
        const url = photo.url.includes(process.env.S3_ENDPOINT as string)
          ? (await ctx.fileservice.getSignedUrl(photo.url)).signedUrl
          : photo.url;

        photos.push({
          url,
          caption: photo.caption,
        });
      }

      return {
        photos: photos,
      };
    },
  },
};
