import gql from 'graphql-tag';

export const jobeTypedefs = gql`
  type CallInstanceGeoJob {
    id: ID!
    workspaceId: ID!
    workspace: Workspace!
    referenceId: ID
    type: String!
    title: String!
    input: JSONObject
  }

  type Mutation {
    callInstanceGeoJob(
      msisdn: String!
      phoneTargetId: ID!
    ): CallInstanceGeoJob! @access(subject: "CALL_INSTANCE_GEO", action: CREATE)

    getInstanceGeoJob(id: ID!): CallInstanceGeoJob!
      @access(subject: "CALL_INSTANCE_GEO", action: READ)
  }
`;
