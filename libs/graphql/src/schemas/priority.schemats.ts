import gql from 'graphql-tag';

export const priorityTypeDef = gql`
  enum PRIORITY {
    HIGH
    MEDIUM
    LOW
    CRITICAL
    URGENT
  }
`;
