import gql from 'graphql-tag';

export const deleteOperationResultTypeDef = gql`
  type DeleteOperationResult {
    success: Boolean!
  }
`;
