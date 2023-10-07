import { PrimaryRepository } from '@cell-mon/db';
import {
  ForbiddenError,
  GraphqlContext,
  NotfoundResource,
} from '@cell-mon/graphql';
import { v4 } from 'uuid';

import {
  MutationCreateTargetEvidenceArgs,
  MutationUpdateTargetEvidenceArgs,
  QueryGetTargetEvidenceByTargetIdArgs,
} from '../../codegen-generated';

export class TargetEvidenceService extends PrimaryRepository<
  'target_evidence',
  GraphqlContext
> {
  constructor(ctx: GraphqlContext) {
    super(ctx);
    this.dbColumns = [
      'target_evidence.id as id',
      'target_evidence.targetId as targetId',
      'target_evidence.note as note',
      'target_evidence.evidence as evidence',
      'target_evidence.investigatedDate as investigatedDate',
    ];
  }

  private async verifyTargetIdInWorkspace(targetId?: string) {
    if (!targetId) return;

    const target = await this.db
      .selectFrom('target')
      .select('id')
      .where('id', '=', targetId)
      .where('workspaceId', '=', this.context.workspaceId)
      .executeTakeFirst();

    if (!target?.id) {
      throw new ForbiddenError('you are not allow to this target');
    }
  }

  async create(input: MutationCreateTargetEvidenceArgs) {
    await this.verifyTargetIdInWorkspace(input.targetId);
    return this.db.insertInto('target_evidence').values({
      id: v4(),
      targetId: input.targetId,
      note: input.note,
      investigatedDate: input.investigatedDate,
      createdBy: this.context.accountId,
      evidence: input.evidence,
    });
  }

  async update(input: MutationUpdateTargetEvidenceArgs) {
    const updated = await this.db
      .updateTable('target_evidence')
      .set({
        note: input.note,
        investigatedDate: input.investigatedDate,
        updatedBy: this.context.accountId,
        evidence: input.evidence,
      })
      .returning(this.dbColumns)
      .executeTakeFirst();

    if (!updated?.id) {
      throw new NotfoundResource(['id']);
    }

    return updated;
  }

  async delete(id: string) {
    const deleted = await this.db
      .updateTable('target_evidence')
      .set({
        deletedAt: new Date(),
        deleteBy: this.context.accountId,
      })
      .innerJoin('target', 'target.id', 'target_evidence.targetId')
      .where('id', '=', id)
      .where('target.workspaceId', '=', this.context.workspaceId)
      .returning(this.dbColumns)
      .executeTakeFirst();

    if (!deleted) {
      throw new NotfoundResource(['id']);
    }

    return deleted;
  }

  async findById(id: string) {
    const targetEvidence = await this.db
      .selectFrom('target_evidence')
      .select(this.dbColumns)
      .innerJoin('target', 'target.id', 'target_evidence.targetId')
      .where('id', '=', id)
      .where('target.workspaceId', '=', this.context.workspaceId)
      .executeTakeFirst();

    if (!targetEvidence) {
      throw new NotfoundResource(['id']);
    }

    return targetEvidence;
  }

  findManyByTargetId(filter: QueryGetTargetEvidenceByTargetIdArgs) {
    return this.db
      .selectFrom('target_evidence')
      .select(this.dbColumns)
      .where('targetId', '=', filter.targetId)
      .innerJoin('target', 'target.id', 'target_evidence.targetId')
      .where('target.workspaceId', '=', this.context.workspaceId)
      .limit(filter.pagination?.limit ?? this.defaultLimit)
      .offset(filter.pagination?.offset ?? this.defaultOffset)
      .execute();
  }
}
