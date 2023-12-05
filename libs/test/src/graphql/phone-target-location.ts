import { getAdminClient } from '@cell-mon/graphql-client';
import { nanoid } from 'nanoid';

import { testCreatePhoneTarget } from './phone-target';

export async function testCreatePhoneTargetLocation() {
  const phoneTarget = await testCreatePhoneTarget();
  const client = await getAdminClient();

  return client.mutation({
    createPhoneTargetLocation: {
      __scalar: true,
      __args: {
        hrlReferenceId: nanoid(),
        status: 'COMPLETED',
        phoneTargetLocation: {
          phoneTargetId: phoneTarget.id,
          sourceDateTime: new Date(),
        },
        network: {
          code: '66',
          operator: 'OPERATOR',
          country: 'Thailand',
          mcc: '433',
          mnc: '03',
        },
        cellInfo: {
          cid: 'CID',
          type: 'GSM',
          lac: 'LAC',
          range: '1000m',
        },
        geoLocations: [
          {
            source: 'MOCK_SOURCE',
            latitude: '53.471',
            longtitude: '53.472',
          },
        ],
      },
    },
  });
}
