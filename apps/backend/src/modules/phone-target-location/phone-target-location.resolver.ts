import { ForbiddenError } from '@cell-mon/graphql';
import { createCoreClient } from '@cell-mon/graphql-client';
import * as mercurius from 'mercurius';
import { fetch } from 'undici';

import { AppContext, WebsocketAppContext } from '../../@types/context';
import {
  PhoneTargetJobStatus,
  PhoneTargetLocation,
  Resolvers,
} from '../../codegen-generated';
import { PUBSUB_PHONE_LOCATION_TRACKING_TOPIC } from '../../constants';

export const mutation: Resolvers<AppContext>['Mutation'] = {
  updatePhoneTargetLocation: async (_, input, ctx) => {
    const phoneTargetLocation =
      await ctx.phoneTargetLocationService.update(input);

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
  createHlrGeoJobRequest: async (_, input, ctx) => {
    if (!ctx.apiKey) {
      throw new ForbiddenError('API key is invalid');
    }

    const phone = await ctx.phoneMetadataMsisdnService.findFirst({
      phoneTargetId: input.phoneTargetId,
    });

    const phoneTargetLocation = await ctx.phoneTargetLocationService.create({
      phoneTargetLocation: {
        phoneTargetId: input.phoneTargetId,
        sourceDateTime: new Date(),
      },
      status: PhoneTargetJobStatus.Processing,
    });

    const client = createCoreClient({
      url: process.env.GRAPHQL_CORE_ENDPOINT,
      fetch,
      headers: {
        'x-api-key': ctx.apiKey,
      },
    });

    const response = await client.mutation({
      callHlr: {
        __scalar: true,
        __args: {
          msisdn: phone.msisdn,
          phoneTargetLocationId: phoneTargetLocation.id,
        },
      },
    });

    await ctx.pubsub.publish({
      topic: PUBSUB_PHONE_LOCATION_TRACKING_TOPIC,
      payload: {
        subscribePhoneLocationTracking: {
          ...phoneTargetLocation,
          workspaceId: ctx.workspaceId,
        },
      },
    });

    return {
      dialogId: response.callHlr.dialogId,
    };
  },
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
