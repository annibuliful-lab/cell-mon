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
    assignPhoneToTarget(phoneId: UUID!, targetId: UUID!): PhoneTarget!
      @access(subject: "TARGET", action: CREATE)

    bulkAssignPhonesToTarget(
      targetId: UUID!
      phoneIds: [UUID!]!
    ): [PhoneTarget!]! @access(subject: "TARGET", action: CREATE)

    unassignPhoneFromTarget(id: UUID!): PhoneTargetOperationResult!
      @access(subject: "TARGET", action: DELETE)

    bulkUnassignPhonesFromTarget(ids: [UUID!]!): PhoneTargetOperationResult!
      @access(subject: "TARGET", action: DELETE)
  }

  type Query {
    getPhoneTargetById(id: UUID!): PhoneTarget!
      @access(subject: "TARGET", action: READ)

    getPhoneTargetsByTargetId(targetId: UUID!): [PhoneTarget!]!
      @access(subject: "TARGET", action: READ)
  }
`;
