import gql from 'graphql-tag';

export const missionTypedef = gql`
  enum MissionStatus {
    DRAFT
    PLANNING
    INVESTIGATING
    COMPLETED
    FAILED
  }

  type Mission {
    id: ID!
    title: String!
    description: String
    status: MissionStatus!
    tags: [String!]
  }

  type Mutation {
    createMission(
      title: String!
      description: String
      tags: [String!]
    ): Mission! @access

    updateMission(
      id: ID!
      title: String
      description: String
      status: MissionStatus
      tags: [String!]
    ): Mission! @access

    deleteMission(id: ID!): DeleteOperationResult! @access
  }

  type Query {
    getMissionById(id: ID!): Mission! @access

    getMissions(
      status: MissionStatus
      title: String
      pagination: OffsetPaginationInput
      tags: [String!]
    ): [Mission!]! @access
  }
`;
