import { getAdminClient } from '@cell-mon/graphql-client';
import { generateRandomIMSI } from '@cell-mon/utils';
import { nanoid } from 'nanoid';

export async function testCreatePhoneMetadata() {
  const client = await getAdminClient();

  return (
    await client.mutation({
      createPhoneMetadata: {
        __scalar: true,
        __args: {
          msisdn: nanoid(),
          imsi: generateRandomIMSI(),
        },
      },
    })
  ).createPhoneMetadata;
}
