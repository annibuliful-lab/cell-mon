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
    createWorkspace(input: CreateWorkspaceInput!): Workspace!
    updateWorkspace(id: ID!, input: CreateWorkspaceInput!): Workspace!
  }

  type Query {
    getWorkspaceById(id: ID!): Workspace!
    getWorkspaces(limit: Int, offset: Int): [Workspace!]!
  }
`;
