import { AppContext } from '../../@types/context';
import { JobType, Resolvers } from '../../codegen-generated';

export const mutation: Resolvers<AppContext>['Mutation'] = {
  callHlr: async (_, input, ctx) => {
    const isLoggedin = await ctx.hlrService.isLoggedin();
    if (!isLoggedin.isLoggedin) {
      await ctx.hlrService.loginSession();
    }

    const response = await ctx.hlrService.tracking({
      missionId: '109',
      msisdn: input.msisdn,
    });

    const jobInput = {
      missionId: '109',
      msisdn: input.msisdn,
      dialogId: response.dialogId,
    };

    await ctx.jobService.create({
      referenceId: jobInput.dialogId,
      workspaceId: ctx.workspaceId,
      type: JobType.HlrQuery,
      title: JobType.HlrQuery,
      maxRetries: 1,
      input,
    });

    return {
      dialogId: response.dialogId,
    };
  },
};
