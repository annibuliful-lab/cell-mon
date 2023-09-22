import { PrimaryRepository } from '@cell-mon/db';
import { GraphqlContext } from '@cell-mon/graphql';
import { v4 } from 'uuid';

import { MutationCreateMissionArgs } from '../../codegen-generated';

export class MissionService extends PrimaryRepository<
  'mission',
  GraphqlContext
> {
  create(input: MutationCreateMissionArgs) {
    return this.db
      .insertInto('mission')
      .values({
        id: v4(),
        workspaceId: this.context.workspaceId,
        name: input.name,
        description: input.description,
        createdBy: this.context.accountId,
      })
      .returningAll()
      .executeTakeFirst();
  }
}
