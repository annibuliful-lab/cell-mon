import { AppContext } from '../../@types/context';
import { Resolvers } from '../../codegen-generated';

export const subscription: Resolvers<AppContext>['Subscription'] = {
  subscribePhoneLocationTracking: {
    subscribe: (_, _input, ctx) =>
      ctx.pubsub.subscribe('phone-location-tracking'),
  },
};
