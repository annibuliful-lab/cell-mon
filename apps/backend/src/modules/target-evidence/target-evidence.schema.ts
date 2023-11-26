import gql from 'graphql-tag';

export const targetEvidenceTypeDef = gql`
  type EvidencePhoto {
    url: String!
    caption: String
  }

  type Evidence {
    photos: [EvidencePhoto!]
  }

  type TargetEvidence {
    id: UUID!
    targetId: UUID!
    evidence: Evidence
    note: String
    investigatedDate: DateTime!
  }

  input EvidencePhotoInput {
    url: String!
    caption: String
  }

  input EvidenceInput {
    photos: [EvidencePhotoInput!]
  }

  type Mutation {
    createTargetEvidence(
      targetId: UUID!
      investigatedDate: DateTime!
      note: String!
      evidence: EvidenceInput
    ): TargetEvidence! @access(subject: "TARGET_EVIDENCE", action: CREATE)

    updateTargetEvidence(
      id: UUID!
      investigatedDate: DateTime
      note: String
      evidence: EvidenceInput
    ): TargetEvidence! @access(subject: "TARGET_EVIDENCE", action: UPDATE)

    deleteTargetEvidence(id: UUID!): DeleteOperationResult!
      @access(subject: "TARGET_EVIDENCE", action: DELETE)
  }

  type Query {
    getTargetEvidenceById(id: UUID!): TargetEvidence!
      @access(subject: "TARGET_EVIDENCE", action: READ)

    getTargetEvidenceByTargetId(
      targetId: UUID!
      pagination: OffsetPaginationInput
    ): [TargetEvidence!]! @access(subject: "TARGET_EVIDENCE", action: READ)
  }
`;
