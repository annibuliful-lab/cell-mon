import { PhoneCellInfo, PhoneGeoLocation } from '@cell-mon/db';

import { createQueueClient } from '../client';
import { JOB_KEYS } from '../constants';

export type HlrGeoRequestPayload = {
  jobId: string;
  workspaceId: string;
  imsi: string;
};

export type HlrGeoWebhookPayload = {
  dialogId: string;
  imsi: string;
  range: string;
  cellInfo: Omit<PhoneCellInfo, 'phoneTargetLocationId'>;
  geoLocations: Omit<PhoneGeoLocation, 'phoneTargetLocationId' | 'id'>[];
};

export const hlrGeoRequestQueue = createQueueClient<HlrGeoRequestPayload>({
  name: JOB_KEYS.HLR_GEO_REQUEST,
});

export const hlrGeoWebhookQueue = createQueueClient<HlrGeoWebhookPayload>({
  name: JOB_KEYS.HLR_GEO_WEBHOOK,
});
