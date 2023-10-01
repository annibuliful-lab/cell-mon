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
    ): PermissionAbility! @access(subject: "PERMISSION", action: CREATE)

    updatePermissionAbility(
      id: ID!
      input: UpdatePermissionAbilityInput!
    ): PermissionAbility! @access(subject: "PERMISSION", action: UPDATE)

    deletePermissionAbility(id: ID!): DeleteOperationResult!
      @access(subject: "PERMISSION", action: DELETE)
  }

  type Query {
    getPermissionAbilities(
      filter: PermissionAbilityFilterInput!
    ): [PermissionAbility!]! @access(subject: "PERMISSION", action: READ)
  }
`;
