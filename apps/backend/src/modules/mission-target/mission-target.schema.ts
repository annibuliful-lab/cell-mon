import gql from 'graphql-tag';

export const missionTargetTypeDef = gql`
  type MissionTargetOperationResult {
    ids: [ID!]!
    success: Boolean!
  }

  type MissionTarget {
    id: ID!
    missionId: ID!
    targetId: ID!
    target: Target!
  }

  type Mutation {
    assignTargetToMission(targetId: ID!, missionId: ID!): MissionTarget! @access

    bulkAssignTargetsToMission(
      targetIds: [ID!]!
      missionId: ID!
    ): [MissionTarget!]! @access

    unassignTargetFromMission(id: ID!): MissionTargetOperationResult! @access

    bulkUnassignTargetsFromMission(ids: [ID!]!): MissionTargetOperationResult!
      @access
  }

  type Query {
    getMissionTargetById(id: ID!): MissionTarget! @access

    getMissionTargetsByMissionId(
      missionId: ID!
      targetPriorities: [PRIORITY!]
      pagination: OffsetPaginationInput
    ): [MissionTarget!]! @access
  }
`;
