import { PrimaryRepository } from '@cell-mon/db';
import {
  GraphqlContext,
  InternalGraphqlError,
  NotfoundResource,
} from '@cell-mon/graphql';
import { v4 } from 'uuid';

import {
  CreateWorkspaceInput,
  UpdateWorkspaceInput,
  WorkspaceFilterInput,
} from '../../codegen-generated';

export class WorkspaceService extends PrimaryRepository<
  'workspace',
  GraphqlContext
> {
  constructor(context: GraphqlContext) {
    super(context);
    this.tableColumns = [
      'id',
      'title',
      'description',
      'createdAt',
      'updatedAt',
      'createdBy',
      'updatedBy',
    ];
  }

  async create(input: CreateWorkspaceInput) {
    const permissions = await this.db
      .selectFrom('permission')
      .select(['id'])
      .execute();

    return this.db
      .transaction()
      .setIsolationLevel('read uncommitted')
      .execute(async (tx) => {
        const workspace = await tx
          .insertInto('workspace')
          .values({
            id: v4(),
            ...input,
            createdBy: this.context.accountId,
            updatedBy: this.context.accountId,
          })
          .returning([
            'id',
            'title',
            'description',
            'createdAt',
            'updatedAt',
            'createdBy',
            'updatedBy',
          ])
          .executeTakeFirst();

        if (!workspace) {
          throw new InternalGraphqlError();
        }

        const role = await tx
          .insertInto('workspace_role')
          .values({
            id: v4(),
            workspaceId: workspace.id,
            title: 'OWNER',
            createdBy: this.context.accountId,
          })
          .returning('id')
          .executeTakeFirst();

        if (!role) {
          throw new InternalGraphqlError();
        }

        await tx
          .insertInto('workspace_role_permission')
          .values(
            permissions.map((permission) => ({
              id: v4(),
              roleId: role.id,
              permissionId: permission.id,
              workspaceId: workspace.id,
              createdBy: this.context.accountId,
            })),
          )
          .execute();

        await tx
          .insertInto('workspace_account')
          .values({
            id: v4(),
            roleId: role.id,
            workspaceId: workspace.id,
            accountId: this.context.accountId,
            createdBy: this.context.accountId,
          })
          .execute();

        return workspace;
      });
  }

  async update(id: string, input: UpdateWorkspaceInput) {
    const workspace = await this.db
      .updateTable('workspace')
      .set({
        ...input,
        updatedAt: new Date(),
        updatedBy: this.context.accountId,
      })
      .where('id', '=', id)
      .returning(this.tableColumns)
      .executeTakeFirst();

    if (!workspace) {
      throw new NotfoundResource(['workspace']);
    }

    return workspace;
  }

  async findById(id: string) {
    const workspace = await this.db
      .selectFrom('workspace')
      .select(this.tableColumns)
      .where('id', '=', id)
      .executeTakeFirst();

    if (!workspace) {
      throw new NotfoundResource(['workspace']);
    }

    return workspace;
  }

  findMany(filter: WorkspaceFilterInput) {
    return this.db
      .selectFrom('workspace')
      .select(this.tableColumns)
      .limit(filter.limit ?? 20)
      .offset(filter.offset ?? 0)
      .execute();
  }
}
