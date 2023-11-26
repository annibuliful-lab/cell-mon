import { AppContext } from '../../@types/context';
import { Resolvers } from '../../codegen-generated';

export const mutation: Resolvers<AppContext>['Mutation'] = {
  uploadFile: (_, { file }, ctx) => {
    return ctx.fileservice.upload(file);
  },
  deleteFile: async (_, { key }, ctx) => {
    await ctx.fileservice.delete(key);

    return {
      success: true,
    };
  },
};

export const query: Resolvers<AppContext>['Query'] = {
  getFileSignedUrl: (_, { key }, ctx) => {
    return ctx.fileservice.getSignedUrl(key);
  },
};
