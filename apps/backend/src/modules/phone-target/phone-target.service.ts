import { PrimaryRepository } from '@cell-mon/db';
import {
  ForbiddenError,
  GraphqlContext,
  NotfoundResource,
} from '@cell-mon/graphql';
import { uniq } from 'lodash';
import { v4 } from 'uuid';

import {
  MutationAssignPhoneToTargetArgs,
  MutationBulkAssignPhoneToTargetArgs,
  QueryGetPhoneTargetsByTargetIdArgs,
} from '../../codegen-generated';

export class PhoneTargetService extends PrimaryRepository<
  'phone_target',
  GraphqlContext
> {
  constructor(ctx: GraphqlContext) {
    super(ctx);
    this.dbColumns = [
      'phone_target.id as id',
      'phone_target.phoneId as phoneId',
      'phone_target.targetId as targetId',
    ];
  }

  private async verifyTarget(id: string) {
    const target = await this.db
      .selectFrom('target')
      .select(['workspaceId', 'id'])
      .where('id', '=', id)
      .executeTakeFirst();

    if (!target) {
      throw new NotfoundResource(['id']);
    }

    if (target.workspaceId !== this.context.workspaceId) {
      throw new ForbiddenError('you are not allow to this target');
    }
  }

  async create(input: MutationAssignPhoneToTargetArgs) {
    await this.verifyTarget(input.targetId);

    return this.db
      .insertInto('phone_target')
      .values({
        id: v4(),
        phoneId: input.phoneId,
        targetId: input.targetId,
        createdBy: this.context.accountId,
      })
      .returning(this.dbColumns)
      .executeTakeFirst();
  }

  async bulkCreate(input: MutationBulkAssignPhoneToTargetArgs) {
    return this.db
      .insertInto('phone_target')
      .values(
        uniq(input.phoneIds).map((phoneId) => ({
          id: v4(),
          phoneId,
          targetId: input.targetId,
          createdBy: this.context.accountId,
        })),
      )
      .returning(this.dbColumns)
      .execute();
  }

  async delete(id: string) {
    const deleted = await this.db
      .deleteFrom('phone_target')
      .returning(this.dbColumns)
      .where('phone_target.id', '=', id)
      .innerJoin('target', 'target.id', 'phone_target.targetId')
      .where('target.deletedAt', 'is', null)
      .where('target.workspaceId', '=', this.context.workspaceId);

    if (!deleted) {
      throw new NotfoundResource(['id']);
    }

    return deleted;
  }

  bulkDelete(ids: string[]) {
    return this.db
      .deleteFrom('phone_target')
      .where('id', 'in', uniq(ids))
      .execute();
  }

  async findById(id: string) {
    const phoneTarget = await this.db
      .selectFrom('phone_target')
      .select(this.dbColumns)
      .where('phone_target.id', '=', id)
      .innerJoin('target', 'target.id', 'phone_target.targetId')
      .where('target.deletedAt', 'is', null)
      .where('target.workspaceId', '=', this.context.workspaceId);

    if (!phoneTarget) {
      throw new NotfoundResource(['id']);
    }

    return phoneTarget;
  }

  findManyByTargetId(filter: QueryGetPhoneTargetsByTargetIdArgs) {
    return this.db
      .selectFrom('phone_target')
      .select(this.dbColumns)
      .innerJoin('target', 'target.id', 'phone_target.targetId')
      .where('phone_target.targetId', '=', filter.targetId)
      .where('target.deletedAt', 'is', null)
      .where('target.workspaceId', '=', this.context.workspaceId)
      .execute();
  }
}
