import { getAdminClient } from '@cell-mon/graphql-client';
import { nanoid } from 'nanoid';

import { PRIORITY } from './generated';

type Option = {
  priority?: PRIORITY;
};

export async function testCreateTarget(option?: Option) {
  const title = nanoid();
  const description = nanoid();
  const tags = [nanoid(), nanoid()];
  const photoUrl = nanoid();
  const client = await getAdminClient();
  const target = (
    await client.mutation({
      createTarget: {
        __scalar: true,
        tags: true,
        __args: {
          title,
          tags,
          description,
          photoUrl,
          priority: option?.priority,
        },
      },
    })
  ).createTarget;

  return target;
}
