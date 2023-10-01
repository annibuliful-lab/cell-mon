import { client } from './client';
import { nanoid } from 'nanoid';
import { TEST_ADMIN_ID, TEST_USER_ID, WORKSPACE_ID } from './constants';
import { v4 } from 'uuid';

export async function seedWorkspace() {
  const workspace = await client.workspace.create({
    data: {
      id: WORKSPACE_ID,
      title: nanoid(),
      createdBy: TEST_USER_ID,
      updatedBy: TEST_USER_ID,
      workspaceRoles: {
        create: {
          id: v4(),
          title: 'OWNER',
          createdBy: 'SYSTEM',
          workspaceAccounts: {
            create: {
              id: v4(),
              workspaceId: WORKSPACE_ID,
              accountId: TEST_ADMIN_ID,
              createdBy: 'SYSTEM',
            },
          },
        },
      },
    },
  });

  console.log('create workspace', workspace);
}
