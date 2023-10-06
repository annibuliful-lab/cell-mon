import { PrimaryRepository } from '@cell-mon/db';
import { GraphqlContext, NotfoundResource } from '@cell-mon/graphql';
import { uniq } from 'lodash';
import { v4 } from 'uuid';

import {
  MutationAssignTargetToMissionArgs,
  MutationBulkAssignTargetsToMissionArgs,
  QueryGetMissionTargetsByMissionIdArgs,
} from '../../codegen-generated';

export class MissionTargetService extends PrimaryRepository<
  'mission_target',
  GraphqlContext
> {
  constructor(ctx: GraphqlContext) {
    super(ctx);
    this.dbColumns = [
      'mission_target.id as id',
      'mission_target.missionId as missionId',
      'mission_target.targetId as targetId',
    ];
  }

  create(input: MutationAssignTargetToMissionArgs) {
    return this.db
      .insertInto('mission_target')
      .values({
        id: v4(),
        missionId: input.missionId,
        targetId: input.targetId,
        createdBy: this.context.accountId,
      })
      .returning(this.dbColumns)
      .executeTakeFirst();
  }

  bulkCreate(input: MutationBulkAssignTargetsToMissionArgs) {
    return this.db
      .insertInto('mission_target')
      .values(
        uniq(input.targetIds).map((targetId) => ({
          id: v4(),
          missionId: input.missionId,
          targetId,
          createdBy: this.context.accountId,
        })),
      )
      .returning(this.dbColumns)
      .execute();
  }

  delete(id: string) {
    return this.db
      .deleteFrom('mission_target')
      .where('id', '=', id)
      .executeTakeFirst();
  }

  bulkDelete(ids: string[]) {
    return this.db
      .deleteFrom('mission_target')
      .where('id', 'in', uniq(ids))
      .execute();
  }

  async findById(id: string) {
    const missionTarget = await this.db
      .selectFrom('mission_target')
      .select(this.dbColumns)
      .innerJoin('mission', 'mission.id', 'mission_target.missionId')
      .where('mission.workspaceId', '=', this.context.workspaceId)
      .where('deletedAt', 'is', null)
      .where('id', '=', id)
      .executeTakeFirst();

    if (!missionTarget) {
      throw new NotfoundResource(['id']);
    }

    return missionTarget;
  }

  async findManyByMission(filter: QueryGetMissionTargetsByMissionIdArgs) {
    return this.db
      .selectFrom('mission_target')
      .select(this.dbColumns)
      .innerJoin('mission', 'mission.id', 'mission_target.missionId')
      .where('mission.workspaceId', '=', this.context.workspaceId)
      .where('deletedAt', 'is', null)
      .where('mission.id', '=', filter.missionId)
      .limit(filter.pagination?.limit ?? this.defaultLimit)
      .offset(filter.pagination?.offset ?? this.defaultOffset)
      .execute();
  }
}
