export type HunterCoreWsPayload = {
  type: 'ASYNC_OPERATION_SUCCESS' | string;
  progressInPercentage?: number;
  dialogId: string;
  data?: string;
  returnCode?: {
    value: string;
    code: number;
  };
  _final?: boolean;
};

export type locationNetwork = {
  subscriberStatus?: string;
  cellId?: number;
  lac?: number;
  loacationAge?: number;
  on4G?: boolean;
  lteApi?: boolean;
  enb?: number;
  lcid?: number;
};

export type locationPosition = {
  longitude?: number;
  latitude?: number;
  cellLevel?: boolean;
  source: 'U' | 'C' | 'DC';
};

export type locationCountry = {
  roaming?: false;
  countryCode?: number;
  countryName?: string;
  operatorName?: string;
  mnc?: string;
  mcc?: string;
};

export type Target = {
  msisdn: string;
  imsi: string;
};

export type Location = {
  network: locationNetwork;
  position: locationPosition;
  country: locationCountry;
  radius: number;
  accuracy: number;
};

export type ReturnCode = {
  value: string;
  code: number;
};

export type HunterCoreWsPayloadData = {
  targetId: Target;
  location: Location;
  targetInfo: object;
  returnCode: ReturnCode;
  dialogId: string;
  type: string;
  _final: boolean;
};
