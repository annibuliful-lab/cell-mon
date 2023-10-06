import { getAdminClient } from '@cell-mon/graphql-client';
import { nanoid } from 'nanoid';

export async function testCreateTarget() {
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
        },
      },
    })
  ).createTarget;

  return target;
}
