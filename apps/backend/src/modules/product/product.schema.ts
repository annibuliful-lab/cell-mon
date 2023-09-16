import gql from 'graphql-tag';

export const productTypeDefs = gql`
  enum ProductType {
    STOCK
    CUSTOM_2D
    CUSTOM_3D
  }

  type Product {
    id: ID!
    active: Boolean
    slug: String!
    type: ProductType!
    projectId: ID!
    baseCopiedProductId: ID
    titleId: Int!
    descriptionId: Int!
    tags: [String!]!
  }

  type ProductMedia {
    id: Int!
    active: Boolean!
    productId: ID!
    url: String!
    captionId: String!
  }

  type ProductVariant {
    id: Int!
    productId: ID!
    titleId: Int!
  }

  type ProductVariantOption {
    id: Int!
    variantId: Int!
    titleId: Int!
  }

  type ProductSku {
    id: Int!
    titleId: Int!
    productId: ID!
    active: Boolean!
  }

  type ProductSkuVariantOption {
    id: Int!
    productSkuId: Int!
    variantOptionId: Int!
  }
`;
