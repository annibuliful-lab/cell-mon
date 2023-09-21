import { PrimaryRepository } from '@cell-mon/db';
import { GraphqlContext, NotfoundResource } from '@cell-mon/graphql';
import { v4 } from 'uuid';

import {
  CreatePermissionAbilityInput,
  PermissionAbilityFilterInput,
  UpdatePermissionAbilityInput,
} from '../../codegen-generated';

export class PermissionAbilityService extends PrimaryRepository<
  'permission',
  GraphqlContext
> {
  constructor(context: GraphqlContext) {
    super(context);
    this.dbColumns = ['action', 'id', 'subject'];
  }

  create(input: CreatePermissionAbilityInput) {
    return this.db
      .insertInto('permission')
      .values({
        id: v4(),
        ...input,
      })
      .returningAll()
      .executeTakeFirst();
  }

  async update(id: string, input: UpdatePermissionAbilityInput) {
    const updatedResult = await this.db
      .updateTable('permission')
      .set(input)
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirst();

    if (!updatedResult) {
      throw new NotfoundResource(['id']);
    }

    return updatedResult;
  }

  async delete(id: string) {
    const deleteResult = await this.db
      .deleteFrom('permission')
      .where('id', '=', id)
      .returning('id')
      .executeTakeFirst();

    if (!deleteResult) {
      throw new NotfoundResource(['id']);
    }

    return deleteResult;
  }

  async findById(id: string) {
    const permissionAbility = await this.db
      .selectFrom('permission')
      .select(this.dbColumns)
      .where('id', '=', id)
      .executeTakeFirst();

    if (!permissionAbility) {
      throw new NotfoundResource(['id']);
    }

    return permissionAbility;
  }

  async findMany(filter: PermissionAbilityFilterInput) {
    return this.db
      .selectFrom('permission')
      .select(this.dbColumns)
      .$if(!!filter.subject, (qb) => qb.where('subject', '=', filter.subject))
      .offset(filter.offset ?? 0)
      .limit(filter.limit ?? 20)
      .execute();
  }
}
