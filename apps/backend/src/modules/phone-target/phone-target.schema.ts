import gql from 'graphql-tag';

export const phoneTargetTypeDef = gql`
  type PhoneTargetOperationResult {
    ids: [ID!]!
    success: Boolean!
  }

  type PhoneTarget {
    id: UUID!
    phoneId: UUID!
    phone: PhoneMetadata!
    targetId: UUID!
    target: Target!
  }

  type Mutation {
    assignPhoneToTarget(phoneId: UUID!, targetId: UUID!): PhoneTarget! @access

    bulkAssignPhoneToTarget(
      targetId: UUID!
      phoneIds: [UUID!]!
    ): [PhoneTarget!]! @access

    unassignPhoneFromTarget(id: UUID!): PhoneTargetOperationResult! @access

    bulkUnassignPhoneFromTarget(ids: [UUID!]!): PhoneTargetOperationResult!
      @access
  }

  type Query {
    getPhoneTargetById(id: UUID!): PhoneTarget! @access

    getPhoneTargetsByTargetId(targetId: UUID!): [PhoneTarget!]! @access
  }
`;
