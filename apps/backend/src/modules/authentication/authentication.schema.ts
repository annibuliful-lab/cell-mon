import gql from 'graphql-tag';

export const authenticationTypeDefs = gql`
  type LogoutOperationResult {
    token: String!
    invokeDateTime: String!
  }

  type Authentication {
    token: String!
    refreshToken: String!
  }

  input LoginInput {
    username: String!
    password: String!
  }

  type Mutation {
    login(input: LoginInput!): Authentication!
    refreshToken: Authentication! @authorize
    logout: LogoutOperationResult! @authorize
  }
`;
