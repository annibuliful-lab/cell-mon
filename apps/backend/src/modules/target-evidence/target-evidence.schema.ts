import gql from 'graphql-tag';

export const targetEvidenceTypeDef = gql`
  type EvidencePhoto {
    url: String!
    caption: String
  }

  type Evidence {
    photos: EvidencePhoto!
  }

  type TargetEvidence {
    id: UUID!
    targetid: UUID!
    evidence: Evidence
    note: String
    investigatedDate: DateTime!
  }

  input EvidencePhotoInput {
    url: String!
    caption: String
  }

  input EvidenceInput {
    photos: EvidencePhotoInput!
  }

  type Mutation {
    createTargetEvidence(
      targetId: UUID!
      investigatedDate: DateTime!
      note: String!
      evidence: EvidenceInput
    ): TargetEvidence! @access

    updateTargetEvidence(
      id: UUID!
      investigatedDate: DateTime
      note: String
      evidence: EvidenceInput
    ): TargetEvidence! @access

    deleteTargetEvidence(id: UUID!): DeleteOperationResult! @access
  }

  type Query {
    getTargetEvidenceById(id: UUID!): TargetEvidence! @access

    getTargetEvidenceByTargetId(
      targetId: UUID!
      pagination: OffsetPaginationInput
    ): [TargetEvidence!]! @access
  }
`;
