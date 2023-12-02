import gql from 'graphql-tag';

export const hlrTypeDefs = gql`
  type CallHrlResponse {
    dialogId: ID!
  }

  type Mutation {
    callHlr(msisdn: String!): CallHrlResponse!
  }

  type Query {
    hrl: String!
  }
`;
