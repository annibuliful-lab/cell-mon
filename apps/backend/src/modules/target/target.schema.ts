import gql from 'graphql-tag';

export const targetTypeDef = gql`
  enum PRIORITY {
    HIGH
    MEDIUM
    LOW
    CRITICAL
    URGENT
  }

  type Target {
    id: ID!
    title: String
    description: String
    photoUrl: String
    address: String
    priority: PRIORITY!
    tags: [String!]
    metadata: JSONObject
  }
`;
