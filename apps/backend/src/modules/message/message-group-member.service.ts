import { PrimaryRepository } from '@tadchud-erp/db';
import { IGraphqlContext, NotfoundResource } from '@tadchud-erp/graphql';
import { MessageGroupMember } from 'kysely-codegen';
import { isNil } from 'lodash';

import {
  CreateMessageGroupMemberInput,
  DeleteMessageGroupMemberInput,
  MessageGroupMemberFilterInput,
} from '../../codegen-generated';

export class MessageGroupMemberService extends PrimaryRepository<
  'message_group_member',
  IGraphqlContext
> {
  constructor(context: IGraphqlContext) {
    super(context);
    this.dbColumns = [
      'message_group_member.accountId as accountId',
      'message_group_member.role as role',
      'message_group_member.messageGroupId as messageGroupId',
      'message_group_member.updatedAt as updatedAt',
      'message_group_member.updatedBy as updatedBy',
      'message_group_member.createdAt as createdAt',
      'message_group_member.createdBy as createdBy',
    ];
  }

  async create(input: CreateMessageGroupMemberInput) {
    return this.db
      .insertInto('message_group_member')
      .values({
        messageGroupId: Number(input.messageGroupId),
        accountId: Number(input.accountId),
        role: input.role,
        createdBy: this.context.accountId,
        updatedBy: this.context.accountId,
      })
      .returningAll()
      .executeTakeFirst();
  }

  async delete(input: DeleteMessageGroupMemberInput) {
    return this.db
      .deleteFrom('message_group_member')
      .where('accountId', '=', Number(input.accountId))
      .where('messageGroupId', '=', Number(input.messageGroupId))
      .returningAll()
      .executeTakeFirst();
  }

  async findById(
    filter: Required<
      Pick<MessageGroupMemberFilterInput, 'accountId' | 'messageGroupId'>
    >
  ) {
    const groupMember = await this.db
      .selectFrom('message_group_member')
      .select(this.dbColumns)
      .where('accountId', '=', Number(filter.accountId))
      .where('messageGroupId', '=', Number(filter.messageGroupId))
      .executeTakeFirst();

    if (!groupMember) {
      throw new NotfoundResource(['accountId', 'messageGroupId']);
    }

    return groupMember as MessageGroupMember;
  }

  findMany(filter: MessageGroupMemberFilterInput) {
    return this.db
      .selectFrom('message_group_member')
      .select(this.dbColumns)
      .where('messageGroupId', '=', Number(filter.messageGroupId))
      .$if(!isNil(filter.search), (qb) =>
        qb
          .innerJoin('account', 'account.id', 'message_group_member.accountId')
          .where('account.fullname', 'ilike', `%${filter.search}%`)
      )
      .limit(filter.limit ?? 20)
      .offset(filter.offset ?? 0)
      .orderBy('message_group_member.createdAt', 'desc')
      .execute() as Promise<MessageGroupMember[]>;
  }
}
