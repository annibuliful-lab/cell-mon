import gql from 'graphql-tag';

export const serialIdTypeDef = gql`
  scalar SerialId
`;

import { GraphQLScalarType, Kind } from 'graphql';

export const serialIdScalar = new GraphQLScalarType({
  name: 'SerialId',
  description: 'Primary key',
  serialize(value) {
    if (typeof value === 'bigint') {
      return Number(value);
    }

    if (typeof value === 'number') {
      return value;
    }

    if (typeof value === 'string') {
      return Number();
    }

    throw Error('GraphQL Serial id Scalar serializer expected a `Int` object');
  },
  parseValue(value) {
    if (typeof value === 'number') {
      return value;
    }
    throw new Error('GraphQL Serial id Scalar parser expected a `number`');
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return Number(ast.value);
    }

    return null;
  },
});
