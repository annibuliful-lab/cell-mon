import { AppContext } from '../../@types/context';
import { Resolvers } from '../../codegen-generated';

export const mutation: Resolvers<AppContext>['Mutation'] = {
  uploadFile: (_, { file }, ctx) => {
    return ctx.fileservice.upload(file);
  },
};
