import { getAdminClient } from '@cell-mon/graphql-client';

import { testCreatePhoneMetadata } from './phone';
import { testCreateTarget } from './target';

export async function testCreatePhoneTarget() {
  const target = await testCreateTarget();
  const phone = await testCreatePhoneMetadata();
  const client = await getAdminClient();

  const phoneTarget = (
    await client.mutation({
      assignPhoneToTarget: {
        __scalar: true,
        __args: {
          phoneId: phone.id,
          targetId: target.id,
        },
      },
    })
  ).assignPhoneToTarget;

  return phoneTarget;
}
