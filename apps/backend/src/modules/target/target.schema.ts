import gql from 'graphql-tag';

export const targetTypeDef = gql`
  type Target {
    id: UUID!
    title: String!
    description: String
    photoUrl: String
    address: String
    priority: PRIORITY!
    tags: [String!]
    metadata: JSONObject
    evidences(pagination: OffsetPaginationInput): [TargetEvidence!]
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
      id: UUID!
      title: String!
      description: String
      photoUrl: String
      address: String
      priority: PRIORITY
      tags: [String!]
    ): Target! @access

    deleteTarget(id: UUID!): DeleteOperationResult! @access
  }

  type Query {
    getTargetById(id: UUID!): Target! @access

    getTargets(
      search: String
      priorities: [PRIORITY!]
      tags: [String!]
      pagination: OffsetPaginationInput
    ): [Target!]! @access
  }
`;
