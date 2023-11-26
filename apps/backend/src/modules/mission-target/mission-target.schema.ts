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
    assignTargetToMission(targetId: ID!, missionId: ID!): MissionTarget!
      @access(subject: "MISSION_TARGET", action: CREATE)

    bulkAssignTargetsToMission(
      targetIds: [ID!]!
      missionId: ID!
    ): [MissionTarget!]! @access(subject: "MISSION_TARGET", action: CREATE)

    unassignTargetFromMission(id: ID!): MissionTargetOperationResult!
      @access(subject: "MISSION_TARGET", action: DELETE)

    bulkUnassignTargetsFromMission(ids: [ID!]!): MissionTargetOperationResult!
      @access(subject: "MISSION_TARGET", action: DELETE)
  }

  type Query {
    getMissionTargetById(id: ID!): MissionTarget!
      @access(subject: "MISSION_TARGET", action: READ)

    getMissionTargetsByMissionId(
      missionId: ID!
      targetPriorities: [PRIORITY!]
      pagination: OffsetPaginationInput
    ): [MissionTarget!]! @access(subject: "MISSION_TARGET", action: READ)
  }
`;
