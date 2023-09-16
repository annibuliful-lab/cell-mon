import { makeExecutableSchema } from '@graphql-tools/schema';
import {
  accessDirective,
  authorizeDirective,
  authorizeMessageGroupDirective,
} from '@tadchud-erp/graphql';
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
