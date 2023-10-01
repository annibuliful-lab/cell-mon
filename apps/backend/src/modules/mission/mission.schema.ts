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
  }

  type Mutation {
    createMission(title: String!, description: String): Mission! @access

    updateMission(
      id: ID!
      title: String
      description: String
      status: MissionStatus
    ): Mission! @access

    deleteMission(id: ID!): DeleteOperationResult! @access
  }

  type Query {
    getMissionById(id: ID!): Mission! @access

    getMissions(status: MissionStatus, title: String): Mission! @access
  }
`;
