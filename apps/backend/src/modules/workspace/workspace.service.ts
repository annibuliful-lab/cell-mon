import { PrimaryRepository } from '@cell-mon/db';
import { GraphqlContext, NotfoundResource } from '@cell-mon/graphql';

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
    this.dbColumns = [
      'id',
      'title',
      'description',
      'createdAt',
      'updatedAt',
      'createdBy',
      'updatedBy',
    ];
  }

  create(input: CreateWorkspaceInput) {
    return this.db
      .insertInto('workspace')
      .values({
        ...input,
        createdBy: this.context.accountId,
        updatedBy: this.context.accountId,
      })
      .returning(this.dbColumns)
      .executeTakeFirst();
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
      .returning(this.dbColumns)
      .executeTakeFirst();

    if (!workspace) {
      throw new NotfoundResource(['workspace']);
    }

    return workspace;
  }

  async findById(id: string) {
    const workspace = await this.db
      .selectFrom('workspace')
      .select(this.dbColumns)
      .where('id', '=', id)
      .executeTakeFirst();

    if (!workspace) {
      throw new NotfoundResource(['workspace']);
    }

    return workspace;
  }

  findManyByAccountId(filter: WorkspaceFilterInput) {
    return this.db
      .selectFrom('workspace')
      .select(this.dbColumns)

      .limit(filter.limit ?? 20)
      .offset(filter.offset ?? 0)
      .execute();
  }
}
