import { Client, getAdminClient } from '@cell-mon/graphql-client';
import { nanoid } from 'nanoid';

describe('Workspace', () => {
  let client: Client;

  beforeAll(async () => {
    client = await getAdminClient();
  });

  it('creates new', async () => {
    const title = nanoid();

    const workspace = await client.mutation({
      createWorkspace: {
        __scalar: true,
        __args: {
          input: {
            title,
          },
        },
      },
    });

    expect(title).toEqual(workspace.createWorkspace.title);
  });
});
