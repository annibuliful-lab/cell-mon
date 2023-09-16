import gql from 'graphql-tag';

export const accountTypeDefs = gql`
  type Account {
    id: ID!
    username: String!
  }

  input CreateAccountInput {
    username: String!
    password: String!
  }

  input UpdateAccountInput {
    password: String
    newPassword: String
    username: String
  }

  type Mutation {
    createAccount(input: CreateAccountInput!): Account!
    updateAccount(id: ID!, input: UpdateAccountInput!): Account!
  }

  type Query {
    me: Account!
  }
`;
