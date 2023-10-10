import { mapArrayToStringRecord, PrimaryRepository } from '@cell-mon/db';
import {
  DuplicatedResource,
  GraphqlContext,
  NotfoundResource,
} from '@cell-mon/graphql';
import { Expression, SqlBool } from 'kysely';
import { isNil, uniq } from 'lodash';
import { v4 } from 'uuid';

import {
  MutationCreateMissionArgs,
  MutationUpdateMissionArgs,
  QueryGetMissionsArgs,
} from '../../codegen-generated';

export class MissionService extends PrimaryRepository<
  'mission',
  GraphqlContext
> {
  constructor(ctx: GraphqlContext) {
    super(ctx);
    this.tableColumns = ['id', 'description', 'title', 'status', 'tags'];
  }

  private async validateDuplicateTitle(title?: string) {
    if (!title) return;

    const duplicateTitle = await this.db
      .selectFrom('mission')
      .select('id')
      .where('title', '=', title)
      .where('deletedAt', 'is', null)
      .where('workspaceId', '=', this.context.workspaceId)
      .executeTakeFirst();

    if (!isNil(duplicateTitle?.id)) {
      throw new DuplicatedResource(['title']);
    }
  }

  async create(input: MutationCreateMissionArgs) {
    await this.validateDuplicateTitle(input.title);

    return this.db
      .insertInto('mission')
      .values({
        tags: uniq(input.tags) as never,
        id: v4(),
        title: input.title,
        description: input.description,
        createdBy: this.context.accountId,
        workspaceId: this.context.workspaceId,
      })
      .returningAll()
      .executeTakeFirst();
  }

  async update(input: MutationUpdateMissionArgs) {
    await this.validateDuplicateTitle(input.title);

    const mission = await this.db
      .updateTable('mission')
      .set({
        tags: uniq(input.tags) as never,
        title: input.title,
        description: input.description,
        status: input.status,
        updatedAt: new Date(),
      })
      .where('id', '=', input.id)
      .returningAll()
      .executeTakeFirst();

    if (!mission?.id) {
      throw new NotfoundResource(['id']);
    }

    return mission;
  }

  async findById(id: string) {
    const mission = await this.db
      .selectFrom('mission')
      .select(this.tableColumns)
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .where('workspaceId', '=', this.context.workspaceId)
      .executeTakeFirst();

    if (!mission?.id) {
      throw new NotfoundResource(['id']);
    }

    return mission;
  }

  async delete(id: string) {
    const deleted = await this.db
      .updateTable('mission')
      .set({
        deletedAt: new Date(),
        deleteBy: this.context.accountId,
      })
      .where('id', '=', id)
      .returning('id')
      .executeTakeFirst();

    if (!deleted?.id) {
      throw new NotfoundResource(['id']);
    }
  }

  async findMany(filter: QueryGetMissionsArgs) {
    return this.db
      .selectFrom('mission')
      .select(this.tableColumns)
      .where((qb) => {
        const exprs: Expression<SqlBool>[] = [
          qb('deletedAt', 'is', null),
          qb('workspaceId', '=', this.context.workspaceId),
        ];

        if (filter.status) {
          exprs.push(qb('status', '=', filter.status));
        }

        if (filter.title) {
          exprs.push(qb('title', 'ilike', `%${filter.title}%`));
        }

        if (filter.tags) {
          exprs.push(qb('tags', '&&', mapArrayToStringRecord(filter.tags)));
        }

        return qb.and(exprs);
      })
      .limit(filter.pagination?.limit ?? this.defaultLimit)
      .offset(filter.pagination?.offset ?? this.defaultOffset)
      .execute();
  }
}
