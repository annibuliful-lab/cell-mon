import gql from 'graphql-tag';

export const workspaceTypeDefs = gql`
  type WorkspaceRolePermission {
    roleId: ID!
    subject: String!
    action: PermissionAction!
  }

  type WorkspaceRole {
    id: ID!
    title: String!
    permissions: [WorkspaceRolePermission!]
  }

  type Workspace {
    id: ID!
    title: String!
    description: String
    roles: [WorkspaceRole!]
  }

  input WorkspaceFilterInput {
    accountId: ID!
    limit: Int
    offset: Int
  }

  input CreateWorkspaceInput {
    title: String!
    description: String
  }

  input UpdateWorkspaceInput {
    title: String
    description: String
  }

  type Mutation {
    createWorkspaceRole(title: String!, permissionIds: [ID!]!): WorkspaceRole!
      @access

    createWorkspace(input: CreateWorkspaceInput!): Workspace! @access

    updateWorkspace(id: ID!, input: CreateWorkspaceInput!): Workspace! @access
  }

  type Query {
    getWorkspaceById(id: ID!): Workspace! @access

    getWorkspaces(limit: Int, offset: Int): [Workspace!]! @access
  }
`;
