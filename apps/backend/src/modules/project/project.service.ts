import { PrimaryRepository } from '@tadchud-erp/db';
import { IGraphqlContext, NotfoundResource } from '@tadchud-erp/graphql';
import { transformToSlug } from '@tadchud-erp/utils';
import { Project } from 'kysely-codegen';
import { isNil } from 'lodash';

import {
  CreateProjectInput,
  ProjectFilterInput,
  UpdateProjectInput,
} from '../../codegen-generated';

export class ProjectService extends PrimaryRepository<
  'project',
  IGraphqlContext
> {
  constructor(context: IGraphqlContext) {
    super(context);
    this.dbColumns = [
      'id',
      'title',
      'slug',
      'active',
      'createdAt',
      'updatedAt',
      'deletedAt',
      'createdBy',
      'updatedBy',
      'workspaceId',
      'description',
      'logo',
      'pricingPlanId',
      'type',
    ];
  }

  create(input: CreateProjectInput) {
    return this.db
      .insertInto('project')
      .values({
        ...input,
        slug: input.slug || transformToSlug(input.title),
        workspaceId: this.context.workspaceId as number,
        pricingPlanId: 1,
        createdBy: this.context.accountId,
        updatedBy: this.context.accountId,
      })
      .returningAll()
      .executeTakeFirst();
  }

  async update(id: number, input: UpdateProjectInput) {
    const updatedResult = await this.db
      .updateTable('project')
      .set({ ...input, updatedAt: new Date() })
      .where('id', '=', id)
      .where('workspaceId', '=', this.context.workspaceId as number)
      .returningAll()
      .executeTakeFirst();

    if (!updatedResult) {
      throw new NotfoundResource(['id']);
    }

    return updatedResult;
  }

  async delete(id: number) {
    const deletedResult = await this.db
      .deleteFrom('project')
      .where('id', '=', id)
      .where('workspaceId', '=', this.context.workspaceId as number)
      .returning('id')
      .executeTakeFirst();

    if (!deletedResult) {
      throw new NotfoundResource(['id']);
    }

    return deletedResult;
  }

  async findById(id: number) {
    const project = await this.db
      .selectFrom('project')
      .select(this.dbColumns)
      .where('id', '=', id)
      .executeTakeFirst();

    if (!project) {
      throw new NotfoundResource(['id']);
    }

    return project as Project;
  }

  findMany(filter: ProjectFilterInput) {
    return this.db
      .selectFrom('project')
      .select(this.dbColumns)
      .$if(!isNil(filter.search), (qb) => qb.where('title', '=', filter.search))
      .$if(!isNil(filter.active), (qb) =>
        qb.where('active', '=', filter.active)
      )
      .where('workspaceId', '=', this.context.workspaceId)
      .limit(filter.limit || 20)
      .offset(filter.offset || 0)
      .execute() as Promise<Project[]>;
  }
}
