import gql from 'graphql-tag';

export const phoneTypeDefs = gql`
  type PhoneMetadataImsi {
    id: ID!
    imsi: String!
    operator: String!
    mcc: String!
    mnc: String!
  }

  type PhoneMetadata {
    id: UUID!
    msisdn: String!
    imsi: String
    imsiInfo: PhoneMetadataImsi
  }

  type Mutation {
    createPhoneMetadata(msisdn: String!, imsi: String): PhoneMetadata! @access
    updatePhoneMetadata(
      id: UUID!
      imsi: String
      msisdn: String
    ): PhoneMetadata! @access

    createPhoneMetadataImsi(imsi: String!): PhoneMetadataImsi!
      @access(requiredApiKey: true)
  }

  type Query {
    getPhoneById(id: UUID!): PhoneMetadata! @access
    getPhones(msisdn: String, imsi: String): [PhoneMetadata!]! @access
  }
`;
