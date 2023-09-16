import { PrimaryRepository } from '@tadchud-erp/db';
import { IGraphqlContext, NotfoundResource } from '@tadchud-erp/graphql';
import { Workspace } from 'kysely-codegen';

import {
  CreateWorkspaceInput,
  UpdateWorkspaceInput,
  WorkspaceFilterInput,
} from '../../codegen-generated';

export class WorkspaceService extends PrimaryRepository<
  'workspace',
  IGraphqlContext
> {
  constructor(context: IGraphqlContext) {
    super(context);
    this.dbColumns = [
      'id',
      'ownerId',
      'slug',
      'title',
      'description',
      'createdAt',
      'updatedAt',
      'deletedAt',
      'createdBy',
      'updatedBy',
    ];
  }

  create(input: CreateWorkspaceInput) {
    return this.db
      .insertInto('workspace')
      .values({
        ...input,
        ownerId: Number(this.context.accountId),
        createdBy: this.context.accountId,
        updatedBy: this.context.accountId,
      })
      .returning(this.dbColumns)
      .executeTakeFirst();
  }

  async update(id: number, input: UpdateWorkspaceInput) {
    const workspace = await this.db
      .updateTable('workspace')
      .set({
        ...input,
        updatedAt: new Date(),
        updatedBy: this.context.accountId,
      })
      .where('id', '=', id)
      .returning(this.dbColumns)
      .executeTakeFirst();

    if (!workspace) {
      throw new NotfoundResource(['workspace']);
    }

    return workspace;
  }

  async findById(id: number) {
    const workspace = await this.db
      .selectFrom('workspace')
      .select(this.dbColumns)
      .where('id', '=', id)
      .executeTakeFirst();

    if (!workspace) {
      throw new NotfoundResource(['workspace']);
    }

    return workspace as Workspace;
  }

  findManyByAccountId(filter: WorkspaceFilterInput) {
    return this.db
      .selectFrom('workspace')
      .select(this.dbColumns)
      .where('ownerId', '=', filter.accountId)
      .limit(filter.limit ?? 20)
      .offset(filter.offset ?? 0)
      .execute() as Promise<Workspace[]>;
  }
}
