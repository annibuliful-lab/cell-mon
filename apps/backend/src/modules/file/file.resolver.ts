import { AppContext } from '../../@types/context';
import { Resolvers } from '../../codegen-generated';

export const mutationResolver: Resolvers<AppContext>['Mutation'] = {
  uploadFile: (_, { file }, ctx) => {
    return ctx.fileservice.upload(file);
  },
};
