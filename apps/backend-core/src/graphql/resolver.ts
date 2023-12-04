import {
  JSONObjectResolver,
  LatitudeResolver,
  LongitudeResolver,
  UUIDResolver,
} from 'graphql-scalars';

import { Resolvers } from '../codegen-generated';
import { mutation as hlrMutationResolver } from '../modules/hlr/hlr.resolver';
import {
  mutation as jobMutationResolver,
  query as jobQueryResolver,
} from '../modules/job/job.resolver';

export const resolvers: Resolvers = {
  Mutation: {
    ...hlrMutationResolver,
    ...jobMutationResolver,
  },
  Query: {
    ...jobQueryResolver,
  },
  UUID: UUIDResolver,
  Latitude: LatitudeResolver,
  Longitude: LongitudeResolver,
  JSONObject: JSONObjectResolver,
};
