import gql from 'graphql-tag';

export const phoneTypeDefs = gql`
  type PhoneMetadataImsi {
    id: ID!
    imsi: String!
    operator: String!
    mcc: String!
    mnc: String!
  }

  type PhoneMetadataMsisdn {
    id: ID!
    msisdn: String!
  }

  type PhoneMetadata {
    id: UUID!
    msisdnId: String!
    msisdn: PhoneMetadataMsisdn
    imsiId: String
    imsi: PhoneMetadataImsi
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
