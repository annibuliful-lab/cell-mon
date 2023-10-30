import { AppContext } from '../../@types/context';
import { Resolvers } from '../../codegen-generated';

export const mutation: Resolvers<AppContext>['Mutation'] = {
  callInstanceGeoJob: (_, input, ctx) => {
    return ctx.jobService.callInstanceGeo(input);
  },
};

export const query: Resolvers<AppContext>['Query'] = {
  getInstanceGeoJob: (_, input, ctx) => {
    return ctx.jobService.getInstanceGeo(input);
  },
};
