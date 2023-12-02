import {
  LatitudeResolver,
  LongitudeResolver,
  UUIDResolver,
} from 'graphql-scalars';

import { Resolvers } from '../codegen-generated';
import { mutation as hlrMutationResolver } from '../modules/hlr/hlr.resolver';

export const resolvers: Resolvers = {
  Mutation: {
    ...hlrMutationResolver,
  },
  UUID: UUIDResolver,
  Latitude: LatitudeResolver,
  Longitude: LongitudeResolver,
};
