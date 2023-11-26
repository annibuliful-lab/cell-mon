import { PrimaryRepository } from '@cell-mon/db';
import { GraphqlContext, NotfoundResource } from '@cell-mon/graphql';
import { Expression, SqlBool } from 'kysely';
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
    this.tableColumns = [
      'permission.action as action',
      'permission.id as id',
      'permission.subject as subject',
    ];
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
      .select(this.tableColumns)
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
      .select(this.tableColumns)
      .where((qb) => {
        const exprs: Expression<SqlBool>[] = [];

        if (filter.subject) {
          exprs.push(qb('subject', '=', filter.subject));
        }

        return qb.and(exprs);
      })
      .limit(filter.limit ?? 20)
      .offset(filter.offset ?? 0)
      .execute();
  }

  async findManyByRoleId(roleId: string) {
    return this.db
      .selectFrom('permission')
      .innerJoin(
        'workspace_role_permission',
        'permission.id',
        'workspace_role_permission.permissionId',
      )
      .select([
        'permission.action as action',
        'permission.id as id',
        'permission.subject as subject',
        'workspace_role_permission.roleId as roleId',
      ])
      .where('workspace_role_permission.roleId', '=', roleId)
      .execute();
  }
}
