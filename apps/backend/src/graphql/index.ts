import { accessDirective, authorizeDirective } from '@cell-mon/graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';
import compose from 'lodash/fp/compose';

import { resolvers } from './resolver';
import { typeDefs } from './schema';
const { authorizedDirectiveValidator } = authorizeDirective();
const { accessDirectiveValidator } = accessDirective();

let schema = makeExecutableSchema({ typeDefs, resolvers });

schema = compose(
  authorizedDirectiveValidator,
  accessDirectiveValidator
)(schema);

export default schema;
