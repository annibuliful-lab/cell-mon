import { JobRepository } from '@cell-mon/db';
import { NotfoundResource } from '@cell-mon/graphql';
import { v4 } from 'uuid';

import { GraphqlContext } from '../../@types/context';
import {
  Job,
  MutationCreateJobArgs,
  MutationUpdateJobArgs,
} from '../../codegen-generated';

export class JobService extends JobRepository<'job', GraphqlContext> {
  constructor(ctx: GraphqlContext) {
    super(ctx);
    this.tableColumns = [
      'id',
      'completedAt',
      'createdAt',
      'errorMessage',
      'input',
      'input',
      'maxRetries',
      'referenceId',
      'result',
      'retryCount',
      'startedAt',
      'status',
      'title',
      'type',
      'workspaceId',
    ];
  }

  create(input: MutationCreateJobArgs): Promise<Job> {
    return this.db
      .insertInto('job')
      .values({
        id: v4(),
        input: input.input,
        workspaceId: input.workspaceId,
        type: input.type,
        title: input.title,
        maxRetries: input.maxRetries,
        referenceId: input.referenceId,
      })
      .returningAll()
      .executeTakeFirst() as Promise<Job>;
  }

  update(input: MutationUpdateJobArgs): Promise<Job> {
    return this.db
      .updateTable('job')
      .set({
        updatedAt: new Date(),
        input: input.input,
        completedAt: input.completedAt,
        maxRetries: input.maxRetries,
        result: input.result,
        status: input.status,
      })
      .returningAll()
      .where('id', '=', input.id)
      .executeTakeFirst() as Promise<Job>;
  }

  async findById(id: string): Promise<Job> {
    const job = await this.db
      .selectFrom('job')
      .select(this.tableColumns)
      .where('id', '=', id)
      .executeTakeFirst();

    if (!job) {
      throw new NotfoundResource(['id']);
    }

    return job as unknown as Promise<Job>;
  }

  async findFirstByReferenceId(referenceId: string): Promise<Job> {
    const job = await this.db
      .selectFrom('job')
      .select(this.tableColumns)
      .where('referenceId', '=', referenceId)
      .executeTakeFirst();

    if (!job) {
      throw new NotfoundResource(['id']);
    }

    return job as unknown as Promise<Job>;
  }
}
