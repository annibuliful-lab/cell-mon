import { PrimaryRepository } from '@cell-mon/db';
import { IGraphqlContext, NotfoundResource } from '@cell-mon/graphql';
import { PermissionAbility } from 'kysely-codegen';
import { v4 } from 'uuid';

import {
  CreatePermissionAbilityInput,
  PermissionAbilityFilterInput,
  UpdatePermissionAbilityInput,
} from '../../codegen-generated';

export class PermissionAbilityService extends PrimaryRepository<
  'permission_ability',
  IGraphqlContext
> {
  constructor(context: IGraphqlContext) {
    super(context);
    this.dbColumns = [
      'action',
      'id',
      'createdAt',
      'createdBy',
      'updatedAt',
      'updatedBy',
      'subject',
    ] as const;
  }

  create(input: CreatePermissionAbilityInput) {
    return this.db
      .insertInto('permission_ability')
      .values({
        id: v4(),
        ...input,
        createdBy: this.context.accountId,
        updatedBy: this.context.accountId,
      })
      .returningAll()
      .executeTakeFirst();
  }

  async update(id: string, input: UpdatePermissionAbilityInput) {
    const updatedResult = await this.db
      .updateTable('permission_ability')
      .set({
        ...input,
        updatedBy: this.context.accountId,
        updatedAt: new Date(),
      })
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
      .deleteFrom('permission_ability')
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
      .selectFrom('permission_ability')
      .select(this.dbColumns)
      .where('id', '=', id)
      .executeTakeFirst();

    if (!permissionAbility) {
      throw new NotfoundResource(['id']);
    }

    return permissionAbility as PermissionAbility;
  }

  async findMany(filter: PermissionAbilityFilterInput) {
    return this.db
      .selectFrom('permission_ability')
      .select(this.dbColumns)
      .$if(!!filter.subject, (qb) => qb.where('subject', '=', filter.subject))
      .offset(filter.offset ?? 0)
      .limit(filter.limit ?? 20)
      .execute() as Promise<PermissionAbility[]>;
  }
}
