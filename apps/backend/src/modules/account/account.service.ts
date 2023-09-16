import { PrimaryRepository } from '@cell-mon/db';
import {
  DuplicatedResource,
  IGraphqlContext,
  NotfoundResource,
} from '@cell-mon/graphql';
import { hash } from 'argon2';
import { v4 } from 'uuid';

import {
  Account,
  CreateAccountInput,
  UpdateAccountInput,
} from '../../codegen-generated';

export class AccountService extends PrimaryRepository<
  'account',
  IGraphqlContext
> {
  constructor(ctx: IGraphqlContext) {
    super(ctx);
    this.dbColumns = ['account.id'];
  }
  async create(input: CreateAccountInput) {
    const user = await this.db
      .selectFrom('account')
      .select(['id'])
      .where('username', '=', input.username)
      .executeTakeFirst();

    if (user) {
      throw new DuplicatedResource(['username']);
    }

    input.password = await hash(input.password);

    return this.db
      .insertInto('account')
      .values({
        id: v4(),
        ...input,
      })
      .returningAll()
      .executeTakeFirst();
  }

  async update(id: string, input: UpdateAccountInput) {
    const user = await this.db
      .updateTable('account')
      .set(input)
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirst();

    if (!user) {
      throw new NotfoundResource(['id']);
    }

    return user;
  }

  async findById(id: string) {
    return this.db
      .selectFrom('account')
      .select(this.dbColumns)
      .where('id', '=', id)
      .executeTakeFirst() as unknown as Promise<Account>;
  }
}
