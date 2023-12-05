import gql from 'graphql-tag';

export const hlrTypeDefs = gql`
  type CallHrlResponse {
    dialogId: ID!
  }

  type Mutation {
    callHlr(msisdn: String!, phoneTargetLocationId: ID!): CallHrlResponse!
  }

  type Query {
    hrl: String!
  }
`;
