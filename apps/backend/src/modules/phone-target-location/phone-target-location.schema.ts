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
    metadata: JSONObject
    sourceDateTime: DateTime!
    network: PhoneNetwork!
    cellInfo: PhoneCellInfo!
    geoLocations: [PhoneGeoLocation!]!
  }

  type PhoneNetwork {
    phoneLocationId: UUID!
    code: String!
    name: String!
    operator: String!
    mnc: String!
    mcc: String!
  }

  type PhoneCellInfo {
    phoneLocationId: UUID!
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
    phoneLocationId: UUID!
    latitude: Latitude!
    longtitude: Longitude!
    source: String
  }
`;
