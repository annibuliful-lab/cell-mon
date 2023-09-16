import { PrimaryRepository } from '@tadchud-erp/db';
import { IGraphqlContext, NotfoundResource } from '@tadchud-erp/graphql';

import {
  MutationCreateWorkspaceFeatureFlagArgs,
  MutationDeleteWorkspaceFeatureFlagArgs,
  QueryGetWorkspaceFeatureFlagsArgs,
} from '../../codegen-generated';

export class FeatureFlagService extends PrimaryRepository<
  'feature_flag',
  IGraphqlContext
> {
  create(flag: string) {
    return this.db
      .insertInto('feature_flag')
      .values({ flag })
      .returningAll()
      .executeTakeFirst();
  }

  async delete(flag: string) {
    const deletedResult = await this.db
      .deleteFrom('feature_flag')
      .where('flag', '=', flag)
      .returning('flag')
      .executeTakeFirst();

    if (!deletedResult) {
      throw new NotfoundResource(['flag']);
    }

    return deletedResult;
  }

  findMany() {
    return this.db.selectFrom('feature_flag').select('flag').execute();
  }
}

export class WorkspaceFeatureflagService extends PrimaryRepository<
  'workspace_feature_flag',
  IGraphqlContext
> {
  create(input: MutationCreateWorkspaceFeatureFlagArgs) {
    return this.db
      .insertInto('workspace_feature_flag')
      .values({
        workspaceId: Number(input.workspaceId),
        featureFlagId: input.flag,
      })
      .returningAll()
      .executeTakeFirst();
  }

  async delete(input: MutationDeleteWorkspaceFeatureFlagArgs) {
    const deletedResult = await this.db
      .deleteFrom('workspace_feature_flag')
      .where('featureFlagId', '=', input.featureFlagId)
      .where('workspaceId', '=', Number(input.workspaceId))
      .returningAll()
      .executeTakeFirst();

    if (!deletedResult) {
      throw new NotfoundResource(['workspace feature flag']);
    }

    return deletedResult;
  }

  findMany(input: QueryGetWorkspaceFeatureFlagsArgs) {
    return this.db
      .selectFrom('workspace_feature_flag')
      .select('featureFlagId')
      .where('workspaceId', '=', Number(input.workspaceId))
      .execute();
  }
}
