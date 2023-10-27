import { AppContext } from '../../@types/context';
import { Resolvers } from '../../codegen-generated';

export const mutation: Resolvers<AppContext>['Mutation'] = {
  uploadFile: (_, { file }, ctx) => {
    return ctx.fileservice.upload(file);
  },
};

export const query: Resolvers<AppContext>['Query'] = {
  getFileSignedUrl: (_, { key }, ctx) => {
    return ctx.fileservice.getSignedUrl(key);
  },
};
