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

  it('creates new role', async () => {
    const title = nanoid();
    const permissions = await client.query({
      getPermissionAbilities: {
        __scalar: true,
        __args: {
          filter: {
            subject: 'TEST',
          },
        },
      },
    });

    const role = await client.mutation({
      createWorkspaceRole: {
        __scalar: true,
        permissions: {
          __scalar: true,
        },
        __args: {
          title,
          permissionIds: permissions.getPermissionAbilities.map((p) => p.id),
        },
      },
    });

    expect(role.createWorkspaceRole.permissions.map((p) => p.id)).toEqual(
      permissions.getPermissionAbilities.map((p) => p.id),
    );
    expect(role.createWorkspaceRole.title).toEqual(title);
  });

  it('gets by id', async () => {
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
        },
        __args: {
          id: created.createWorkspace.id,
        },
      },
    });

    expect(workspace.getWorkspaceById.roles[0].title).toEqual('OWNER');
    expect(title).toEqual(workspace.getWorkspaceById.title);
  });
});
