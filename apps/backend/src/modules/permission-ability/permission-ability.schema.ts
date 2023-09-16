import gql from 'graphql-tag';

export const permissionAbilityTypeDefs = gql`
  enum PermissionAction {
    CREATE
    UPDATE
    DELETE
    READ
  }

  input CreatePermissionAbilityInput {
    action: PermissionAction!
    subject: String!
  }

  input UpdatePermissionAbilityInput {
    action: PermissionAction
    subject: String
  }

  input PermissionAbilityFilterInput {
    limit: Int
    offset: Int
    subject: String
  }

  type PermissionAbility {
    id: ID!
    action: PermissionAction!
    subject: String!
  }

  type Mutation {
    createPermissionAbility(
      input: CreatePermissionAbilityInput!
    ): PermissionAbility!
      @access(
        conditions: { subject: "PERMISSION", action: CREATE, role: "KeyAdmin" }
      )
    updatePermissionAbility(
      id: ID!
      input: UpdatePermissionAbilityInput!
    ): PermissionAbility!
      @access(
        conditions: { subject: "PERMISSION", action: CREATE, role: "KeyAdmin" }
      )
    deletePermissionAbility(id: ID!): DeleteOperationResult!
      @access(
        conditions: { subject: "PERMISSION", action: CREATE, role: "KeyAdmin" }
      )
  }

  type Query {
    getPermissionAbilities(
      filter: PermissionAbilityFilterInput!
    ): [PermissionAbility!]!
      @access(
        conditions: { subject: "PERMISSION", action: READ, role: "KeyAdmin" }
      )
  }
`;
