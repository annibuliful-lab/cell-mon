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
    id: UUID!
    action: PermissionAction!
    subject: String!
  }

  type Mutation {
    createPermissionAbility(
      input: CreatePermissionAbilityInput!
    ): PermissionAbility! @access(subject: "PERMISSION", action: CREATE)

    updatePermissionAbility(
      id: UUID!
      input: UpdatePermissionAbilityInput!
    ): PermissionAbility! @access(subject: "PERMISSION", action: UPDATE)

    deletePermissionAbility(id: UUID!): DeleteOperationResult!
      @access(subject: "PERMISSION", action: DELETE)
  }

  type Query {
    getPermissionAbilities(
      filter: PermissionAbilityFilterInput!
    ): [PermissionAbility!]! @access
  }
`;
