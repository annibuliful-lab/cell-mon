import {
  accessDirective,
  authorizeDirective,
  authorizeMessageGroupDirective,
} from '@cell-mon/graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';
import compose from 'lodash/fp/compose';

import { resolvers } from './resolver';
import { typeDefs } from './schema';
const { authorizedDirectiveValidator } = authorizeDirective();
const { accessDirectiveValidator } = accessDirective();
const { authorizeMessageGroupDirectiveValidator } =
  authorizeMessageGroupDirective();

let schema = makeExecutableSchema({ typeDefs, resolvers });

schema = compose(
  authorizedDirectiveValidator,
  accessDirectiveValidator,
  authorizeMessageGroupDirectiveValidator
)(schema);

export default schema;
