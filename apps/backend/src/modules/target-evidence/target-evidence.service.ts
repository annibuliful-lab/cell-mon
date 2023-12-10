import { PrimaryRepository } from '@cell-mon/db';
import {
  ForbiddenError,
  GraphqlContext,
  NotfoundResource,
} from '@cell-mon/graphql';
import { v4 } from 'uuid';

import {
  Evidence,
  MutationCreateTargetEvidenceArgs,
  MutationUpdateTargetEvidenceArgs,
  QueryGetTargetEvidenceByTargetIdArgs,
  TargetEvidence,
} from '../../codegen-generated';

export class TargetEvidenceService extends PrimaryRepository<
  'target_evidence',
  GraphqlContext
> {
  constructor(ctx: GraphqlContext) {
    super(ctx);
    this.tableColumns = [
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
      .select(['workspaceId'])
      .where('id', '=', targetId)
      .executeTakeFirst();

    if (!target) {
      throw new NotfoundResource(['id']);
    }

    if (target.workspaceId !== this.context.workspaceId) {
      throw new ForbiddenError('you are not allow to this target');
    }
  }

  async create(input: MutationCreateTargetEvidenceArgs) {
    await this.verifyTargetIdInWorkspace(input.targetId);
    return this.db
      .insertInto('target_evidence')
      .values({
        id: v4(),
        targetId: input.targetId,
        note: input.note,
        investigatedDate: input.investigatedDate,
        createdBy: this.context.accountId,
        evidence: {
          ...input,
          photos:
            input.evidence?.photos?.map((photo) => ({
              url: photo.key,
              caption: photo.caption,
            })) ?? [],
        },
      })
      .returning(this.tableColumns)
      .executeTakeFirst();
  }

  async update(input: MutationUpdateTargetEvidenceArgs) {
    const targetEvidence = await this.findById(input.id);
    await this.verifyTargetIdInWorkspace(targetEvidence?.targetId);

    const updated = await this.db
      .updateTable('target_evidence')
      .set({
        note: input.note,
        investigatedDate: input.investigatedDate,
        updatedBy: this.context.accountId,
        evidence: {
          ...input,
          photos:
            input.evidence?.photos?.map((photo) => ({
              url: photo.key,
              caption: photo.caption,
            })) ?? [],
        },
      })
      .where('id', '=', input.id)
      .returning(this.tableColumns)
      .executeTakeFirst();

    if (!updated?.id) {
      throw new NotfoundResource(['id']);
    }

    return updated;
  }

  async delete(id: string) {
    const targetEvidence = await this.findById(id);
    await this.verifyTargetIdInWorkspace(targetEvidence?.targetId);

    const deleted = await this.db
      .updateTable('target_evidence')
      .set({
        deletedAt: new Date(),
        deleteBy: this.context.accountId,
      })
      .where('target_evidence.id', '=', id)
      .returning(this.tableColumns)
      .executeTakeFirst();

    if (!deleted) {
      throw new NotfoundResource(['id']);
    }

    return deleted;
  }

  async findById(id: string) {
    const targetEvidence = await this.db
      .selectFrom('target_evidence')
      .select(this.tableColumns)
      .innerJoin('target', 'target.id', 'target_evidence.targetId')
      .where('target_evidence.deletedAt', 'is', null)
      .where('target_evidence.id', '=', id)
      .where('target.workspaceId', '=', this.context.workspaceId)
      .executeTakeFirst();

    if (!targetEvidence) {
      throw new NotfoundResource(['id']);
    }

    return targetEvidence;
  }

  async findManyByTargetId(
    filter: QueryGetTargetEvidenceByTargetIdArgs,
    verifyTargetId = true,
  ): Promise<TargetEvidence[]> {
    if (verifyTargetId) {
      await this.verifyTargetIdInWorkspace(filter.targetId);
    }

    const evidences = await this.db
      .selectFrom('target_evidence')
      .select(this.tableColumns)
      .where('targetId', '=', filter.targetId)
      .innerJoin('target', 'target.id', 'target_evidence.targetId')
      .where('target_evidence.deletedAt', 'is', null)
      .where('target.workspaceId', '=', this.context.workspaceId)
      .limit(filter.pagination?.limit ?? this.defaultLimit)
      .offset(filter.pagination?.offset ?? this.defaultOffset)
      .execute();

    return evidences.map((evidence) => ({
      id: evidence.id,
      targetId: evidence.targetId,
      investigatedDate: evidence.investigatedDate,
      note: evidence.note,
      evidence: evidence.evidence as Evidence,
    }));
  }
}
