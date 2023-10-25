import gql from 'graphql-tag';

export const webhookTypeDef = gql`
  type WebhookResponse {
    success: Boolean!
  }

  type Subscription {
    subscribePhoneLocationTracking: PhoneTargetLocation
  }
`;
