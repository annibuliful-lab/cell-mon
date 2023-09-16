import { PrimaryRepository } from '@tadchud-erp/db';
import { IGraphqlContext, NotfoundResource } from '@tadchud-erp/graphql';
import { MessageGroupData } from 'kysely-codegen';

import {
  CreateMessageGroupDataInput,
  MessageGroupDataFilterInput,
} from '../../codegen-generated';

export class MessageGroupDataService extends PrimaryRepository<
  'message_group_data',
  IGraphqlContext
> {
  constructor(context: IGraphqlContext) {
    super(context);
    this.dbColumns = [
      'message_group_data.authorId as authorId',
      'message_group_data.createdAt as createdAt',
      'message_group_data.createdBy as createdBy',
      'message_group_data.deletedAt as deletedAt',
      'message_group_data.updatedAt as updatedAt',
      'message_group_data.updatedBy as updatedBy',
      'message_group_data.groupId as groupId',
    ];
  }

  create(input: CreateMessageGroupDataInput) {
    return this.db
      .insertInto('message_group_data')
      .values({
        groupId: Number(input.groupId),
        message: JSON.stringify(input.message),
        authorId: Number(this.context.accountId),
        createdBy: this.context.accountId,
        updatedBy: this.context.accountId,
      })
      .returningAll()
      .executeTakeFirst();
  }

  async delete(id: number) {
    const deleted = await this.db
      .updateTable('message_group_data')
      .set({
        deletedAt: new Date(),
      })
      .where('id', '=', id)
      .where('authorId', '=', Number(this.context.accountId))
      .executeTakeFirst();

    if (Number(deleted.numUpdatedRows) === 0) {
      throw new NotfoundResource(['id']);
    }

    return deleted;
  }

  findMany(filter: MessageGroupDataFilterInput) {
    return this.db
      .selectFrom('message_group_data')
      .select(this.dbColumns)
      .where('deletedAt', 'is', null)
      .where('groupId', '=', Number(filter.groupId))
      .$if(!!filter.search, (qb) =>
        qb.where('message', 'ilike', `%${filter.search}%`)
      )
      .limit(filter.limit ?? 20)
      .offset(filter.offset ?? 0)
      .execute() as Promise<MessageGroupData[]>;
  }
}
