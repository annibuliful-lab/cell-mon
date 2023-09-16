import { PrimaryRepository } from '@tadchud-erp/db';
import { IGraphqlContext, NotfoundResource } from '@tadchud-erp/graphql';
import { MessageGroup } from 'kysely-codegen';
import { isNil } from 'lodash';

import {
  CreateMessageGroupInput,
  MessageGroupFilterInput,
  MutationUpdateMessageGroupArgs,
} from '../../codegen-generated';

export class MessageGroupService extends PrimaryRepository<
  'message_group',
  IGraphqlContext
> {
  constructor(context: IGraphqlContext) {
    super(context);
    this.dbColumns = [
      'message_group.id as id',
      'message_group.createdAt as createdAt',
      'message_group.createdBy as createdBy',
      'message_group.picture as picture',
      'message_group.title as title',
      'message_group.updatedAt as updatedAt',
      'message_group.updatedBy as updatedBy',
    ];
  }

  create(input: CreateMessageGroupInput) {
    return this.db.transaction().execute(async (tx) => {
      const group = await tx
        .insertInto('message_group')
        .values({
          title: input.title,
          picture: input.picture,
          createdBy: this.context.accountId,
          updatedBy: this.context.accountId,
        })
        .returningAll()
        .executeTakeFirst();

      if (!group) {
        throw new Error('creating message group is failed');
      }

      await tx
        .insertInto('message_group_member')
        .values({
          messageGroupId: group.id,
          accountId: Number(this.context.accountId),
          role: 'OWNER',
          createdBy: this.context.accountId,
          updatedBy: this.context.accountId,
        })
        .execute();

      return group;
    });
  }

  async update(input: MutationUpdateMessageGroupArgs) {
    const updated = await this.db
      .updateTable('message_group')
      .set({ ...input.input, updatedAt: new Date() })
      .where('id', '=', Number(input.id))
      .where('deletedAt', 'is', null)
      .returningAll()
      .executeTakeFirst();

    if (!updated) {
      throw new NotfoundResource(['id']);
    }

    return updated;
  }

  async delete(id: number) {
    const deleted = await this.db
      .updateTable('message_group')
      .set({
        deletedAt: new Date(),
      })
      .where('message_group.id', '=', Number(id))
      .returningAll()
      .executeTakeFirst();

    if (!deleted) {
      throw new NotfoundResource(['id']);
    }

    return deleted;
  }

  async findById(id: number) {
    const group = await this.db
      .selectFrom('message_group')
      .select(this.dbColumns)
      .innerJoin(
        'message_group_member',
        'message_group_member.messageGroupId',
        'message_group.id'
      )
      .where('message_group.id', '=', id)
      .where('deletedAt', 'is', null)
      .where(
        'message_group_member.accountId',
        '=',
        Number(this.context.accountId)
      )
      .executeTakeFirst();

    if (!group) {
      throw new NotfoundResource(['id']);
    }

    return group as MessageGroup;
  }

  findMany(filter: MessageGroupFilterInput) {
    return this.db
      .selectFrom('message_group')
      .select(this.dbColumns)
      .innerJoin(
        'message_group_member',
        'message_group_member.messageGroupId',
        'message_group.id'
      )
      .where('deletedAt', 'is', null)
      .where(
        'message_group_member.accountId',
        '=',
        Number(this.context.accountId)
      )
      .$if(!isNil(filter.search), (qb) =>
        qb.where('title', 'ilike', `%${filter.search}%`)
      )
      .offset(filter.offset ?? 0)
      .limit(filter.limit ?? 20)
      .execute() as Promise<MessageGroup[]>;
  }
}
