import { mapArrayToStringRecord, PrimaryRepository } from '@cell-mon/db';
import {
  DuplicatedResource,
  GraphqlContext,
  mapDataloaderRecord,
  NotfoundResource,
} from '@cell-mon/graphql';
import DataLoader from 'dataloader';
import { Expression, SqlBool } from 'kysely';
import { uniq } from 'lodash';
import { v4 } from 'uuid';

import {
  MutationCreateTargetArgs,
  MutationUpdateTargetArgs,
  QueryGetTargetsArgs,
  Target,
} from '../../codegen-generated';

export class TargetService extends PrimaryRepository<
  'target',
  GraphqlContext,
  Target
> {
  constructor(ctx: GraphqlContext) {
    super(ctx);

    this.tableColumns = [
      'address',
      'description',
      'id',
      'metadata',
      'photoUrl',
      'priority',
      'tags',
      'title',
    ];
    this.setupDataloader();
  }

  private setupDataloader() {
    this.dataloader = new DataLoader(
      async (ids: readonly string[]) => {
        const targets = await this.findByIds(ids);

        return mapDataloaderRecord<Target>({
          data: targets as Target[],
          ids,
          idField: 'id',
        });
      },
      { cache: false },
    );
  }

  private async validateDuplicatedTitle(title?: string) {
    if (!title) return;

    const duplicated = await this.db
      .selectFrom('target')
      .select('id')
      .where('title', '=', title)
      .where('deletedAt', 'is', null)
      .where('workspaceId', '=', this.context.workspaceId)
      .executeTakeFirst();

    if (duplicated?.id) throw new DuplicatedResource(['title']);
  }

  async create(input: MutationCreateTargetArgs) {
    await this.validateDuplicatedTitle(input.title);
    return this.db
      .insertInto('target')
      .values({
        id: v4(),
        title: input.title,
        description: input.description,
        address: input.address,
        photoUrl: input.photoUrl,
        priority: input.priority,
        tags: uniq(input.tags) as never,
        workspaceId: this.context.workspaceId,
        createdBy: this.context.accountId,
      })
      .returning(this.tableColumns)
      .executeTakeFirst();
  }

  async delete(id: string) {
    const deleted = await this.db
      .updateTable('target')
      .set({
        deletedAt: new Date(),
        deletedBy: this.context.accountId,
      })
      .returning('id')
      .where('id', '=', id)
      .where('workspaceId', '=', this.context.workspaceId)
      .executeTakeFirst();

    if (!deleted?.id) {
      throw new NotfoundResource(['id']);
    }
  }

  async update(input: MutationUpdateTargetArgs) {
    await this.validateDuplicatedTitle(input.title);

    const updated = await this.db
      .updateTable('target')
      .set({
        title: input.title,
        description: input.description,
        address: input.address,
        photoUrl: input.photoUrl,
        priority: input.priority,
        tags: uniq(input.tags) as never,
        updatedAt: new Date(),
        updatedBy: this.context.accountId,
      })
      .where('id', '=', input.id)
      .where('workspaceId', '=', this.context.workspaceId)
      .where('deletedAt', 'is', null)
      .returning(this.tableColumns)
      .executeTakeFirst();

    if (!updated?.id) {
      throw new NotfoundResource(['id']);
    }

    return updated;
  }

  async findById(id: string) {
    const target = await this.db
      .selectFrom('target')
      .select(this.tableColumns)
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .where('workspaceId', '=', this.context.workspaceId)
      .executeTakeFirst();

    if (!target) {
      throw new NotfoundResource(['id']);
    }

    return target;
  }

  findByIds(ids: readonly string[]) {
    return this.db
      .selectFrom('target')
      .select(this.tableColumns)
      .where('id', 'in', uniq(ids))
      .execute();
  }

  async findMany(filter: QueryGetTargetsArgs) {
    return this.db
      .selectFrom('target')
      .select(this.tableColumns)
      .where((qb) => {
        const exprs: Expression<SqlBool>[] = [
          qb('deletedAt', 'is', null),
          qb('workspaceId', '=', this.context.workspaceId),
        ];

        if (filter.priorities) {
          exprs.push(qb('priority', 'in', uniq(filter.priorities)));
        }

        if (filter.search) {
          exprs.push(qb('title', 'ilike', `%${filter.search}%`));
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
