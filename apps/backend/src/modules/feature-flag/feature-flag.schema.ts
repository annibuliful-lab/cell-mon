import gql from 'graphql-tag';

export const featureFlagTypedefs = gql`
  type FeatureFlag {
    flag: ID!
  }

  type WorkspaceFeature {
    workspaceId: ID!
    featureFlagId: ID!
  }

  type Mutation {
    createFeatureFlag(flag: ID!): FeatureFlag!
      @access(
        conditions: {
          subject: "FEATURE_FLAG"
          action: CREATE
          role: "KeyAdmin"
        }
      )

    deleteFeatureFlag(flag: ID!): DeleteOperationResult!
      @access(
        conditions: {
          subject: "FEATURE_FLAG"
          action: CREATE
          role: "KeyAdmin"
        }
      )

    createWorkspaceFeatureFlag(workspaceId: ID!, flag: ID!): WorkspaceFeature!
      @access(
        conditions: {
          subject: "FEATURE_FLAG"
          action: CREATE
          role: "KeyAdmin"
        }
      )

    deleteWorkspaceFeatureFlag(
      featureFlagId: ID!
      workspaceId: ID!
    ): DeleteOperationResult!
      @access(
        conditions: {
          subject: "FEATURE_FLAG"
          action: CREATE
          role: "KeyAdmin"
        }
      )
  }

  type Query {
    getFeatureFlags: [FeatureFlag!]!
      @access(
        conditions: { subject: "FEATURE_FLAG", action: READ, role: "KeyAdmin" }
      )

    getWorkspaceFeatureFlags(workspaceId: ID!): [WorkspaceFeature!]!
      @access(
        conditions: { subject: "FEATURE_FLAG", action: READ, role: "KeyAdmin" }
      )
  }
`;
