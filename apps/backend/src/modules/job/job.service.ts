import { JobRepository } from '@cell-mon/db';
import { GraphqlContext, NotfoundResource } from '@cell-mon/graphql';
import { v4 } from 'uuid';

import {
  CallInstanceGeoJob,
  MutationCallInstanceGeoJobArgs,
  QueryGetInstanceGeoJobArgs,
} from '../../codegen-generated';

export class JobService extends JobRepository<'job', GraphqlContext> {
  constructor(ctx: GraphqlContext) {
    super(ctx);
    this.tableColumns = [
      'id',
      'completedAt',
      'errorMessage',
      'createdAt',
      'input',
      'maxRetries',
      'referenceId',
      'status',
      'title',
      'result',
    ];
  }

  callInstanceGeo(
    input: MutationCallInstanceGeoJobArgs,
  ): Promise<CallInstanceGeoJob> {
    return this.db
      .insertInto('job')
      .values({
        id: v4(),
        status: 'IDLE',
        workspaceId: this.context.workspaceId,
        type: 'INSTANCE_GEO',
        title: input.msisdn,
        input,
        referenceId: input.phoneTargetId,
        maxRetries: input.maxRetries ?? 1,
      })
      .returningAll()
      .executeTakeFirst() as never;
  }

  async getInstanceGeo(
    input: QueryGetInstanceGeoJobArgs,
  ): Promise<CallInstanceGeoJob> {
    const job = this.db
      .selectFrom('job')
      .select(this.tableColumns)
      .where('id', '=', input.id)
      .executeTakeFirst();

    if (!job) {
      throw new NotfoundResource(['id']);
    }

    return job as never;
  }
}
