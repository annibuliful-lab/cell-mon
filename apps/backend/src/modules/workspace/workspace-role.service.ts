import { PrimaryRepository } from '@cell-mon/db';
import {
  GraphqlContext,
  InternalGraphqlError,
  mapDataloaderRecords,
} from '@cell-mon/graphql';
import DataLoader from 'dataloader';
import { v4 } from 'uuid';

import {
  MutationCreateWorkspaceRoleArgs,
  WorkspaceRole,
} from '../../codegen-generated';

export class WorkspaceRoleService extends PrimaryRepository<
  'workspace_role',
  GraphqlContext,
  WorkspaceRole[]
> {
  constructor(ctx: GraphqlContext) {
    super(ctx);

    this.tableColumns = ['id', 'title', 'workspaceId'];

    this.dataloader = new DataLoader(
      async (ids: readonly string[]) => {
        const roles = await this.findByWorkspaceId(ids as string[]);

        return mapDataloaderRecords({
          data: roles,
          ids: ids as string[],
          idField: 'workspaceId',
        });
      },
      { cache: false },
    );
  }

  async create(input: MutationCreateWorkspaceRoleArgs): Promise<WorkspaceRole> {
    return this.db
      .transaction()
      .setIsolationLevel('read committed')
      .execute(async (tx) => {
        const role = await tx
          .insertInto('workspace_role')
          .values({
            id: v4(),
            title: input.title,
            workspaceId: this.context.workspaceId,
            createdBy: this.context.accountId,
          })
          .returningAll()
          .executeTakeFirst();

        if (!role) {
          throw new InternalGraphqlError();
        }

        if (input.permissionIds.length) {
          await tx
            .insertInto('workspace_role_permission')
            .values(
              input.permissionIds.map((id) => ({
                id: v4(),
                workspaceId: this.context.workspaceId,
                roleId: role.id,
                createdBy: this.context.accountId,
                permissionId: id,
              })),
            )
            .execute();
        }

        return {
          id: role.id,
          title: role.title,
        };
      });
  }

  async findByIds(ids: string[]) {
    return this.db
      .selectFrom('workspace_role')
      .select(this.tableColumns)
      .where('id', 'in', ids)
      .execute();
  }

  async findByWorkspaceId(workspaceIds: string[]) {
    return this.db
      .selectFrom('workspace_role')
      .select(this.tableColumns)
      .where('workspaceId', 'in', workspaceIds)
      .execute();
  }
}
