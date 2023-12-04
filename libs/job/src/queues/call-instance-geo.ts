import { PhoneCellInfo, PhoneGeoLocation } from '@cell-mon/db';

import { createQueueClient } from '../client';
import { JOB_KEYS } from '../constants';

export type CallInstanceGeoRequestPayload = {
  jobId: string;
  workspaceId: string;
  imsi: string;
};

export type CallInstanceGeoWebhookPayload = {
  jobId: string;
  workspaceId: string;
  imsi: string;
  tImsiOne?: string;
  tImsiTwo?: string;
  range: string;
  cellInfo: Omit<PhoneCellInfo, 'phoneTargetLocationId'>;
  geoLocations: Omit<PhoneGeoLocation, 'phoneTargetLocationId' | 'id'>[];
  collectedTimestamp: number;
};

export const hlrGeoRequestQueue =
  createQueueClient<CallInstanceGeoRequestPayload>({
    name: JOB_KEYS.HLR_GEO_REQUEST,
  });

export const hlrGeoWebhookQueue =
  createQueueClient<CallInstanceGeoWebhookPayload>({
    name: JOB_KEYS.HLR_GEO_WEBHOOK,
  });
