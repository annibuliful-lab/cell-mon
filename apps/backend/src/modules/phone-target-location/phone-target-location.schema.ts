import gql from 'graphql-tag';

export const phoneTargetLocationTypeDef = gql`
  enum CellularTechnology {
    NR
    LTE
    GSM
    WCDMA
  }

  type PhoneTargetLocation {
    id: UUID!
    phoneTargetId: UUID!
    phoneTarget: PhoneTarget!
    metadata: JSONObject
    sourceDateTime: DateTime!
    network: PhoneNetwork!
    cellInfo: PhoneCellInfo!
    geoLocations: [PhoneGeoLocation!]!
  }

  type PhoneNetwork {
    phoneTargetLocationId: UUID!
    code: String!
    name: String!
    operator: String!
    mnc: String!
    mcc: String!
  }

  type PhoneCellInfo {
    phoneTargetLocationId: UUID!
    type: CellularTechnology!
    cid: String
    lcid: String
    lac: String
    ci: String
    eci: String
    tac: String
    enb: String
    nci: String
  }

  type PhoneGeoLocation {
    id: UUID!
    phoneTargetLocationId: UUID!
    latitude: Latitude!
    longtitude: Longitude!
    source: String!
  }

  input CreatePhoneTargetLocationInput {
    phoneTargetId: UUID!
    metadata: JSONObject
    sourceDateTime: DateTime!
  }

  input CreatePhoneNetworkInput {
    code: String!
    name: String!
    operator: String!
    mnc: String!
    mcc: String!
  }

  input CreatePhoneCellInfoInput {
    type: CellularTechnology!
    cid: String
    lcid: String
    lac: String
    ci: String
    eci: String
    tac: String
    enb: String
    nci: String
  }

  input CreatePhoneGeoLocationInput {
    latitude: Latitude!
    longtitude: Longitude!
    source: String!
  }

  type Mutation {
    createPhoneTargetLocation(
      phoneTargetLocation: CreatePhoneTargetLocationInput!
      network: CreatePhoneNetworkInput!
      cellInfo: CreatePhoneCellInfoInput!
      geoLocations: [CreatePhoneGeoLocationInput!]!
    ): PhoneTargetLocation! @access
  }

  type Query {
    getPhoneTargetLocationById(id: UUID!): PhoneTargetLocation! @access

    getPhoneTargeLocationsByPhoneTargetId(
      phoneTargetId: UUID!
      pagination: OffsetPaginationInput
      startDate: DateTime
      endDate: DateTime
    ): [PhoneTargetLocation!]! @access
  }

  type Subscription {
    subscribePhoneLocationTracking: PhoneTargetLocation
  }
`;
