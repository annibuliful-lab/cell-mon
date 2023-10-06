import gql from 'graphql-tag';

export const targetTypeDef = gql`
  type Target {
    id: ID!
    title: String!
    description: String
    photoUrl: String
    address: String
    priority: PRIORITY!
    tags: [String!]
    metadata: JSONObject
  }

  type Mutation {
    createTarget(
      title: String!
      description: String
      address: String
      photoUrl: String
      priority: PRIORITY
      tags: [String!]
    ): Target! @access

    updateTarget(
      id: ID!
      title: String!
      description: String
      photoUrl: String
      address: String
      priority: PRIORITY
      tags: [String!]
    ): Target! @access

    deleteTarget(id: ID!): DeleteOperationResult! @access
  }

  type Query {
    getTargetById(id: ID!): Target! @access

    getTargets(
      search: String
      priority: PRIORITY
      tags: [String!]
      pagination: OffsetPaginationInput
    ): [Target!]! @access
  }
`;
