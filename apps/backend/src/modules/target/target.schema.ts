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
    ): Target! @access(subject: "TARGET", action: CREATE)

    updateTarget(
      id: UUID!
      title: String!
      description: String
      photoUrl: String
      address: String
      priority: PRIORITY
      tags: [String!]
    ): Target! @access(subject: "TARGET", action: UPDATE)

    deleteTarget(id: UUID!): DeleteOperationResult!
      @access(subject: "TARGET", action: DELETE)
  }

  type Query {
    getTargetById(id: UUID!): Target! @access(subject: "TARGET", action: READ)

    getTargets(
      search: String
      priorities: [PRIORITY!]
      tags: [String!]
      pagination: OffsetPaginationInput
    ): [Target!]! @access(subject: "TARGET", action: READ)
  }
`;
