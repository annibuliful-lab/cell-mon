import { getAdminClient } from '@cell-mon/graphql-client';
import { nanoid } from 'nanoid';

export async function testCreateWorkspace() {
  const client = await getAdminClient();
  const title = nanoid();

  const created = await client.mutation({
    createWorkspace: {
      __scalar: true,
      __args: {
        input: {
          title,
        },
      },
    },
  });

  const workspace = await client.query({
    getWorkspaceById: {
      __scalar: true,
      roles: {
        __scalar: true,
        permissions: {
          __scalar: true,
        },
      },
      __args: {
        id: created.createWorkspace.id,
      },
    },
  });

  return workspace;
}
