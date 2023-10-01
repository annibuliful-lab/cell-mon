import { PrimaryRepository } from '@cell-mon/db';
import {
  DuplicatedResource,
  GraphqlContext,
  NotfoundResource,
} from '@cell-mon/graphql';
import { hash } from 'argon2';
import { v4 } from 'uuid';

import {
  CreateAccountInput,
  UpdateAccountInput,
} from '../../codegen-generated';

export class AccountService extends PrimaryRepository<
  'account',
  GraphqlContext
> {
  constructor(ctx: GraphqlContext) {
    super(ctx);
    this.dbColumns = ['account.id'];
  }

  private async validateDuplicatedUsername(username?: string) {
    if (!username) return;

    const user = await this.db
      .selectFrom('account')
      .select(['id'])
      .where('username', '=', username)
      .executeTakeFirst();

    if (user?.id) {
      throw new DuplicatedResource(['username']);
    }
  }

  async create(input: CreateAccountInput) {
    await this.validateDuplicatedUsername(input.username);

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
    await this.validateDuplicatedUsername(input.username);

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
      .executeTakeFirst();
  }
}
