import gql from 'graphql-tag';

export const jobTypedefs = gql`
  type CallInstanceGeoJob {
    id: ID!
    workspaceId: ID!
    workspace: Workspace!
    referenceId: ID
    type: String!
    title: String!
    input: JSONObject
    result: JSONObject
    retryCount: Int!
    maxRetries: Int!
    errorMessage: String
  }

  type Mutation {
    callInstanceGeoJob(
      msisdn: String!
      phoneTargetId: ID!
      maxRetries: Int = 1
    ): CallInstanceGeoJob! @access(subject: "CALL_INSTANCE_GEO", action: CREATE)
  }

  type Query {
    getInstanceGeoJob(id: ID!): CallInstanceGeoJob!
      @access(subject: "CALL_INSTANCE_GEO", action: READ)
  }
`;
