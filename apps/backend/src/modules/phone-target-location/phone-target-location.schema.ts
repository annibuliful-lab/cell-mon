import gql from 'graphql-tag';

export const phoneTargetLocationTypeDef = gql`
  type CreateHlrGeoJobResponse {
    dialogId: ID!
  }

  enum CellularTechnology {
    NR
    LTE
    GSM
    WCDMA
  }

  enum PhoneTargetJobStatus {
    IDLE
    IN_QUEUE
    PROCESSING
    COMPLETED
    FAILED
  }

  type PhoneTargetLocation {
    id: UUID!
    status: PhoneTargetJobStatus!
    phoneTargetId: UUID!
    phoneTarget: PhoneTarget!
    metadata: JSONObject
    sourceDateTime: DateTime!
    network: PhoneNetwork
    cellInfo: PhoneCellInfo
    geoLocations: [PhoneGeoLocation!]
  }

  type PhoneNetwork {
    phoneTargetLocationId: UUID!
    code: String!
    country: String!
    operator: String!
    mnc: String!
    mcc: String!
  }

  type PhoneCellInfo {
    phoneTargetLocationId: UUID!
    type: CellularTechnology!
    lac: String
    cid: String
    range: String
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
    country: String!
    operator: String!
    mnc: String!
    mcc: String!
  }

  input CreatePhoneCellInfoInput {
    type: CellularTechnology!
    lac: String!
    cid: String!
    range: String!
  }

  input CreatePhoneGeoLocationInput {
    latitude: Latitude!
    longtitude: Longitude!
    source: String!
  }

  type Mutation {
    createPhoneTargetLocation(
      phoneTargetLocation: CreatePhoneTargetLocationInput!
      network: CreatePhoneNetworkInput
      cellInfo: CreatePhoneCellInfoInput
      geoLocations: [CreatePhoneGeoLocationInput!]
      hrlReferenceId: ID!
      status: PhoneTargetJobStatus!
    ): PhoneTargetLocation! @access(requiredApiKey: true)

    createFailedPhoneTargetLocation(
      phoneTargetLocation: CreatePhoneTargetLocationInput!
    ): PhoneTargetLocation! @access(requiredApiKey: true)

    createHrlGeoJobRequest(phoneTargetId: UUID!): CreateHlrGeoJobResponse!
      @access
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
