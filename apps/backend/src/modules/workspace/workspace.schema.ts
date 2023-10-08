import gql from 'graphql-tag';

export const workspaceTypeDefs = gql`
  type Workspace {
    id: Int!
    title: String!
    description: String
  }

  input WorkspaceFilterInput {
    accountId: Int!
    limit: Int
    offset: Int
  }

  input CreateWorkspaceInput {
    slug: String!
    title: String!
    description: String
  }

  input UpdateWorkspaceInput {
    title: String
    description: String
  }

  type Mutation {
    createWorkspace(input: CreateWorkspaceInput!): Workspace! @access
    updateWorkspace(id: UUID!, input: CreateWorkspaceInput!): Workspace! @access
  }

  type Query {
    getWorkspaceById(id: UUID!): Workspace! @access
    getWorkspaces(limit: Int, offset: Int): [Workspace!]! @access
  }
`;
