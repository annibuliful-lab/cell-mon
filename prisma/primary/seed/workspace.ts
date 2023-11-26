import { client } from './client';
import { nanoid } from 'nanoid';
import {
  TEST_ADMIN_ID,
  TEST_USER_A_ID,
  WORKSPACE_A_ID,
  WORKSPACE_ID,
} from './constants';
import { v4 } from 'uuid';

export async function seedWorkspace() {
  const permissions = await client.permission.findMany({
    select: {
      id: true,
    },
  });

  const adminWorkspace = await client.workspace.create({
    data: {
      id: WORKSPACE_ID,
      title: nanoid(),
      createdBy: TEST_ADMIN_ID,
      updatedBy: TEST_ADMIN_ID,
      workspaceConfiguration: {
        create: {
          apiKey: 'ADMIN_WORKSPACE_API_KEY',
          createdBy: TEST_ADMIN_ID,
        },
      },
      workspaceRoles: {
        create: {
          id: v4(),
          title: 'OWNER',
          createdBy: 'SYSTEM',
          workspaceRolePermissions: {
            createMany: {
              data: permissions.map((p) => ({
                id: v4(),
                createdBy: 'SYSTEM',
                workspaceId: WORKSPACE_ID,
                permissionId: p.id,
              })),
              skipDuplicates: true,
            },
          },
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

  const userAWorkspace = await client.workspace.create({
    data: {
      id: WORKSPACE_A_ID,
      title: nanoid(),
      createdBy: TEST_USER_A_ID,
      updatedBy: TEST_USER_A_ID,
      workspaceConfiguration: {
        create: {
          apiKey: 'USER_A_WORKSPACE_API_KEY',
          createdBy: TEST_USER_A_ID,
        },
      },
      workspaceRoles: {
        create: {
          id: v4(),
          title: 'OWNER',
          createdBy: 'SYSTEM',
          workspaceAccounts: {
            create: {
              id: v4(),
              workspaceId: WORKSPACE_ID,
              accountId: TEST_USER_A_ID,
              createdBy: 'SYSTEM',
            },
          },
        },
      },
    },
  });

  console.log('create workspace', { adminWorkspace, userAWorkspace });
}
