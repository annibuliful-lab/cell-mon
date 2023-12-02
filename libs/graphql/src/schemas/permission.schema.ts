import gql from 'graphql-tag';

export const permissionAbilityTypeDefs = gql`
  enum PermissionAction {
    CREATE
    UPDATE
    DELETE
    READ
  }
`;
