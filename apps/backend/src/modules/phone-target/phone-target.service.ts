import { PrimaryRepository } from '@cell-mon/db';
import {
  ForbiddenError,
  GraphqlContext,
  NotfoundResource,
} from '@cell-mon/graphql';
import { difference, uniq } from 'lodash';
import { v4 } from 'uuid';

import {
  MutationAssignPhoneToTargetArgs,
  MutationBulkAssignPhonesToTargetArgs,
  MutationBulkUnassignPhonesFromTargetArgs,
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

  private async verifyPhoneTargets(ids: string[]) {
    const phoneTargets = await this.db
      .selectFrom('phone_target')
      .innerJoin('target', 'target.id', 'phone_target.targetId')
      .select(['target.workspaceId as workspaceId', 'phone_target.id as id'])
      .where('phone_target.id', 'in', ids)
      .execute();

    const notfoundIds = difference(
      ids,
      phoneTargets.map((phoneTarget) => phoneTarget.id),
    );

    if (notfoundIds.length) {
      throw new NotfoundResource([`id: ${notfoundIds.join(', ')}`]);
    }

    const forbiddenIds = phoneTargets.filter(
      (phoneTarget) => phoneTarget.workspaceId !== this.context.workspaceId,
    );

    if (forbiddenIds.length) {
      throw new ForbiddenError(
        `you are not allow to this ids : ${forbiddenIds.join(', ')}`,
      );
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

  async bulkCreate(input: MutationBulkAssignPhonesToTargetArgs) {
    await this.verifyTarget(input.targetId);

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
    await this.verifyPhoneTargets([id]);

    const deleted = await this.db
      .deleteFrom('phone_target')
      .where('phone_target.id', '=', id)
      .executeTakeFirst();

    if (!deleted) {
      throw new NotfoundResource(['id']);
    }

    return deleted;
  }

  async bulkDelete(input: MutationBulkUnassignPhonesFromTargetArgs) {
    await this.verifyPhoneTargets(uniq(input.ids));

    return this.db
      .deleteFrom('phone_target')
      .where('id', 'in', uniq(input.ids))
      .execute();
  }

  async findById(id: string) {
    const phoneTarget = await this.db
      .selectFrom('phone_target')
      .select(this.dbColumns)
      .where('phone_target.id', '=', id)
      .innerJoin('target', 'target.id', 'phone_target.targetId')
      .where('target.deletedAt', 'is', null)
      .where('target.workspaceId', '=', this.context.workspaceId)
      .executeTakeFirst();

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
