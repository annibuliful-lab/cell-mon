import { getAdminClient } from '@cell-mon/graphql-client';

import { testCreatePhoneTarget } from './phone-target';

export async function testCreatePhoneTargetLocation() {
  const phoneTarget = await testCreatePhoneTarget();
  const client = await getAdminClient();

  return client.mutation({
    createPhoneTargetLocation: {
      __scalar: true,
      __args: {
        phoneTargetLocation: {
          phoneTargetId: phoneTarget.id,
          sourceDateTime: new Date(),
        },
        network: {
          code: '66',
          operator: 'OPERATOR',
          name: 'Thailand',
          mcc: '433',
          mnc: '03',
        },
        cellInfo: {
          ci: 'CI',
          type: 'GSM',
          lac: 'LAC',
          tac: 'TAC',
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
