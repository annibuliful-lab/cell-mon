import gql from 'graphql-tag';

export const phoneTypeDefs = gql`
  type PhoneMetadata {
    id: UUID!
    msisdn: String!
    imsi: String
  }

  type Mutation {
    createPhoneMetadata(msisdn: String!, imsi: String): PhoneMetadata! @access
    updatePhoneMetadata(
      id: UUID!
      imsi: String
      msisdn: String
    ): PhoneMetadata! @access
  }

  type Query {
    getPhoneById(id: UUID!): PhoneMetadata! @access
    getPhones(msisdn: String, imsi: String): [PhoneMetadata!]! @access
  }
`;
