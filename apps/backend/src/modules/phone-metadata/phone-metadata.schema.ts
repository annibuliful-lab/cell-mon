import gql from 'graphql-tag';

export const phoneTypeDefs = gql`
  type PhoneMetadata {
    id: ID!
    msisdn: String!
    imsi: String
  }

  type Mutation {
    createPhoneMetadata(msisdn: String!, imsi: String): PhoneMetadata! @access
    updatePhoneMetadata(id: ID!, imsi: String, msisdn: String): PhoneMetadata!
      @access
  }

  type Query {
    getPhoneById(id: ID!): PhoneMetadata! @access
    getPhones(msisdn: String, imsi: String): [PhoneMetadata!]! @access
  }
`;
