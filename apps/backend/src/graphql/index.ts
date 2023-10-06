import { accessDirective } from '@cell-mon/graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { GraphQLSchema } from 'graphql';
import compose from 'lodash/fp/compose';

import { resolvers } from './resolver';
import { typeDefs } from './schema';

const { accessDirectiveValidator } = accessDirective();

const schema: GraphQLSchema = compose(accessDirectiveValidator)(
  makeExecutableSchema({ typeDefs, resolvers }),
);

export default schema;
