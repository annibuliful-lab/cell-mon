import gql from 'graphql-tag';

export const accountTypeDefs = gql`
  type Account {
    id: ID!
    username: String!
  }

  input CreateAccountInput {
    picture: String
    fullname: String
    username: String!
    email: String!
    password: String!
  }

  input UpdateAccountInput {
    password: String
    newPassword: String
    username: String
    email: String
    picture: String
    fullname: String
  }

  type Mutation {
    createAccount(input: CreateAccountInput!): Account!
    updateAccount(id: ID!, input: UpdateAccountInput!): Account!
  }

  type Query {
    me: Account!
  }
`;
