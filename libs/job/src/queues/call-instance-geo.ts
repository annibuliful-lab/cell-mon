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
  accuracy: number;
  radius: number;
  cellInfo: {
    technology: string;
    mnc: string;
    mcc: string;
    operator: string;
    country: string;
    band: string;
    lac: string;
  };
  position: {
    latitude: string;
    longitude: string;
  };
  collectedTimestamp: number;
};

export const callInstanceGeoRequestQueue =
  createQueueClient<CallInstanceGeoRequestPayload>({
    name: JOB_KEYS.INSTANGE_GEO_REQUEST,
  });
