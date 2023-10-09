import gql from 'graphql-tag';

export const phoneTargetLocationTypeDef = gql`
  type PhoneTargetLocation {
    id: UUID!
    phoneTargetId: UUID!
    metadata: JSONObject
    sourceDateTime: DateTime!
  }
`;
