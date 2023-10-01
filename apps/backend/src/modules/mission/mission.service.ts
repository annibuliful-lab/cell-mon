import { Mission, PrimaryRepository } from '@cell-mon/db';
import {
  DuplicatedResource,
  GraphqlContext,
  NotfoundResource,
} from '@cell-mon/graphql';
import { isNil } from 'lodash';
import { v4 } from 'uuid';

import {
  MutationCreateMissionArgs,
  MutationUpdateMissionArgs,
} from '../../codegen-generated';

export class MissionService extends PrimaryRepository<
  'mission',
  GraphqlContext
> {
  constructor(ctx: GraphqlContext) {
    super(ctx);
    this.dbColumns = ['id', 'description', 'title', 'status'];
  }

  private async validateDuplicateTitle(title?: string) {
    const duplicateTitle = await this.db
      .selectFrom('mission')
      .select('id')
      .where('title', '=', title ?? null)
      .where('deletedAt', 'is', null)
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
    const mission = (await this.db
      .selectFrom('mission')
      .select(this.dbColumns)
      .where('id', '=', id)
      .executeTakeFirst()) as unknown as Mission;

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
      })
      .where('id', '=', id)
      .returning('id')
      .executeTakeFirst();

    if (!deleted?.id) {
      throw new NotfoundResource(['id']);
    }
  }
}
