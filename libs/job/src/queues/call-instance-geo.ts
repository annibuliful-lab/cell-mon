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
  position: Omit<PhoneGeoLocation, 'phoneTargetLocationId' | 'id'>;
  collectedTimestamp: number;
};

export const callInstanceGeoRequestQueue =
  createQueueClient<CallInstanceGeoRequestPayload>({
    name: JOB_KEYS.INSTANGE_GEO_REQUEST,
  });
