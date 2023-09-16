import gql from 'graphql-tag';

export const fileTypeDefs = gql`
  scalar Upload

  type File {
    key: String!
    signedUrl: String!
  }

  type Mutation {
    uploadFile(file: Upload!): File!
  }

  type Query {
    getFileSignedUrl(key: String!): File!
  }
`;
