import gql from 'graphql-tag';

export const projectTypeDefs = gql`
  type Project {
    id: ID!
    workspaceId: ID!
    title: String!
    slug: String!
    active: Boolean!
    description: String
    type: String!
    logo: String!
  }

  input CreateProjectInput {
    title: String!
    slug: String
    type: String!
    logo: String!
  }

  input UpdateProjectInput {
    title: String
    description: String
    active: Boolean
    logo: String
  }

  input ProjectFilterInput {
    search: String
    active: Boolean
    limit: Int
    offset: Int
  }

  type Mutation {
    createProject(input: CreateProjectInput!): Project!
      @access(conditions: { requiredWorkspaceId: true })

    updateProject(id: ID!, input: UpdateProjectInput!): Project!
      @access(conditions: { requiredWorkspaceId: true })

    deleteProject(id: ID!): DeleteOperationResult!
      @access(conditions: { requiredWorkspaceId: true })
  }

  type Query {
    getProjectById(id: ID!): Project!
      @access(conditions: { requiredWorkspaceId: true })

    getProjects(filter: ProjectFilterInput!): [Project!]!
      @access(conditions: { requiredWorkspaceId: true })
  }
`;
