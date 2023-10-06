import { getAdminClient } from '@cell-mon/graphql-client';
import { nanoid } from 'nanoid';

export async function testCreateMission() {
  const title = nanoid();
  const description = nanoid();
  const tags = [nanoid(), nanoid()];
  const client = await getAdminClient();
  return (
    await client.mutation({
      createMission: {
        __scalar: true,
        tags: true,
        __args: {
          title,
          description,
          tags,
        },
      },
    })
  ).createMission;
}
