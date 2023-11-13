import * as mercurius from 'mercurius';

import { AppContext, WebsocketAppContext } from '../../@types/context';
import { PhoneTargetLocation, Resolvers } from '../../codegen-generated';
import { PUBSUB_PHONE_LOCATION_TRACKING_TOPIC } from '../../constants';

export const mutation: Resolvers<AppContext>['Mutation'] = {
  createPhoneTargetLocation: async (_, input, ctx) => {
    const phoneTargetLocation =
      await ctx.phoneTargetLocationService.create(input);

    await ctx.pubsub.publish({
      topic: PUBSUB_PHONE_LOCATION_TRACKING_TOPIC,
      payload: {
        subscribePhoneLocationTracking: {
          ...phoneTargetLocation,
          workspaceId: ctx.workspaceId,
        },
      },
    });

    return phoneTargetLocation;
  },
};

export const query: Resolvers<AppContext>['Query'] = {
  getPhoneTargetLocationById: (_, input, ctx) => {
    return ctx.phoneTargetLocationService.findById(input.id);
  },
  getPhoneTargeLocationsByPhoneTargetId: (_, input, ctx) => {
    return ctx.phoneTargetLocationService.findManyByPhoneTargetId(input);
  },
};

export const subscription: Resolvers<WebsocketAppContext>['Subscription'] = {
  subscribePhoneLocationTracking: {
    subscribe: mercurius.default.withFilter<
      {
        subscribePhoneLocationTracking: PhoneTargetLocation & {
          workspaceId: string;
        };
      },
      unknown,
      WebsocketAppContext
    >(
      (_parent, _args, ctx) => {
        return ctx.pubsub.subscribe(PUBSUB_PHONE_LOCATION_TRACKING_TOPIC);
      },
      (payload, _args, ctx) => {
        return (
          payload.subscribePhoneLocationTracking.workspaceId ===
          ctx._connectionInit.workspaceId
        );
      },
    ),
  },
};
