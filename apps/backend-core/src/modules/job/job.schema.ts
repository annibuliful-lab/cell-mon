import gql from 'graphql-tag';

export const jobTypeDefs = gql`
  enum JobType {
    HLR_QUERY
  }

  enum JobStatus {
    IDLE
    IN_QUEUE
    PROCESSING
    COMPLETED
    FAILED
  }

  type Job {
    id: UUID!
    workspaceId: UUID!
    referenceId: ID!
    type: JobType!
    title: String!
    input: JSONObject
    result: JSONObject
    status: JobStatus
    retryCount: Int!
    maxRetries: Int!
    errorMessage: [String!]
    startedAt: DateTime!
    completedAt: DateTime!
  }

  type Mutation {
    createJob(
      workspaceId: UUID!
      referenceId: ID!
      type: JobType!
      title: String!
      input: JSONObject
      maxRetries: Int!
    ): Job! @access(requiredApiKey: true)

    updateJob(
      id: ID!
      referenceId: ID
      input: JSONObject
      result: JSONObject
      status: JobStatus
      maxRetries: Int
      completedAt: DateTime
    ): Job! @access(requiredApiKey: true)
  }

  type Query {
    getJobById(id: ID!): Job! @access(requiredApiKey: true)
    getJobByReferenceId(referenceId: ID): Job! @access(requiredApiKey: true)
  }
`;
