import gql from 'graphql-tag';

export const paginationTypeDef = gql`
  input OffsetPaginationInput {
    limit: Int
    offset: Int
  }

  input CursorPaginationInput {
    first: Int
    after: ID

    before: ID
    last: Int
  }
`;
