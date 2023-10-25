import * as mercurius from 'mercurius';

import { AppContext } from '../../@types/context';
import { PhoneTargetLocation, Resolvers } from '../../codegen-generated';
import { PUBSUB_PHONE_LOCATION_TRACKING_TOPIC } from '../../constants';
export const subscription: Resolvers<AppContext>['Subscription'] = {
  subscribePhoneLocationTracking: {
    // subscribe: (_root, _args, { pubsub }) =>
    //   pubsub.subscribe(PUBSUB_PHONE_LOCATION_TRACKING_TOPIC),
    subscribe: mercurius.default.withFilter<
      {
        subscribePhoneLocationTracking: PhoneTargetLocation & {
          workspaceId: string;
        };
      },
      unknown,
      AppContext
    >(
      (_root, _args, ctx) => {
        return ctx.pubsub.subscribe(PUBSUB_PHONE_LOCATION_TRACKING_TOPIC);
      },
      (payload, _, ctx) => {
        return (
          payload.subscribePhoneLocationTracking.workspaceId === ctx.workspaceId
        );
      },
    ),
  },
};
