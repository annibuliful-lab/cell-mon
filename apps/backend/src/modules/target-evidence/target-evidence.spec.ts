import { Client, getAdminClient } from '@cell-mon/graphql-client';
import { expectNotFoundError, testCreateTarget } from '@cell-mon/test';
import { nanoid } from 'nanoid';
import { v4 } from 'uuid';

describe('Target evidence', () => {
  let client: Client;

  beforeAll(async () => {
    client = await getAdminClient();
  });

  it('creates new', async () => {
    const target = await testCreateTarget();
    const photos = [
      {
        url: nanoid(),
        caption: nanoid(),
      },
    ];

    const note = nanoid();
    const investigatedDate = new Date();
    const targetEvidence = (
      await client.mutation({
        createTargetEvidence: {
          __scalar: true,
          investigatedDate: true,
          evidence: {
            photos: {
              url: true,
              caption: true,
            },
            __scalar: true,
          },
          __args: {
            targetId: target.id,
            investigatedDate,
            note,
            evidence: {
              photos,
            },
          },
        },
      })
    ).createTargetEvidence;
    expect(targetEvidence.targetId).toEqual(target.id);
    expect(targetEvidence.note).toEqual(note);
    expect(targetEvidence.investigatedDate).toBeDefined();
    expect(targetEvidence.evidence.photos).toEqual(photos);
  });

  it('throws not found when create with wrong target id', () => {
    const photos = [
      {
        url: nanoid(),
        caption: nanoid(),
      },
    ];

    const note = nanoid();
    const investigatedDate = new Date();

    expectNotFoundError(
      client.mutation({
        createTargetEvidence: {
          __scalar: true,
          investigatedDate: true,
          evidence: {
            photos: {
              url: true,
              caption: true,
            },
            __scalar: true,
          },
          __args: {
            targetId: v4(),
            investigatedDate,
            note,
            evidence: {
              photos,
            },
          },
        },
      }),
    );
  });

  it('update an existing', async () => {
    const target = await testCreateTarget();
    const photos = [
      {
        url: nanoid(),
        caption: nanoid(),
      },
    ];

    const note = nanoid();
    const investigatedDate = new Date();
    const targetEvidence = (
      await client.mutation({
        createTargetEvidence: {
          __scalar: true,
          investigatedDate: true,
          evidence: {
            photos: {
              url: true,
              caption: true,
            },
            __scalar: true,
          },
          __args: {
            targetId: target.id,
            investigatedDate,
            note,
            evidence: {
              photos,
            },
          },
        },
      })
    ).createTargetEvidence;

    const newNote = nanoid();
    const newEvidence = [
      {
        url: nanoid(),
        caption: nanoid(),
      },
    ];

    const updated = (
      await client.mutation({
        updateTargetEvidence: {
          investigatedDate: true,
          evidence: {
            photos: {
              url: true,
              caption: true,
            },
            __scalar: true,
          },
          __scalar: true,
          __args: {
            id: targetEvidence.id,
            note: newNote,
            evidence: {
              photos: newEvidence,
            },
          },
        },
      })
    ).updateTargetEvidence;

    expect(updated.targetId).toEqual(target.id);
    expect(updated.note).toEqual(newNote);
    expect(updated.investigatedDate).toBeDefined();
    expect(updated.evidence.photos).toEqual(newEvidence);
  });

  it('throws not found when update wrong id', async () => {
    const newNote = nanoid();
    const newEvidence = [
      {
        url: nanoid(),
        caption: nanoid(),
      },
    ];

    expectNotFoundError(
      client.mutation({
        updateTargetEvidence: {
          investigatedDate: true,
          evidence: {
            photos: {
              url: true,
              caption: true,
            },
            __scalar: true,
          },
          __scalar: true,
          __args: {
            id: v4(),
            note: newNote,
            evidence: {
              photos: newEvidence,
            },
          },
        },
      }),
    );
  });

  it('delete an existing', async () => {
    const target = await testCreateTarget();
    const photos = [
      {
        url: nanoid(),
        caption: nanoid(),
      },
    ];

    const note = nanoid();
    const investigatedDate = new Date();
    const targetEvidence = (
      await client.mutation({
        createTargetEvidence: {
          __scalar: true,
          investigatedDate: true,
          evidence: {
            photos: {
              url: true,
              caption: true,
            },
            __scalar: true,
          },
          __args: {
            targetId: target.id,
            investigatedDate,
            note,
            evidence: {
              photos,
            },
          },
        },
      })
    ).createTargetEvidence;

    const deleted = await client.mutation({
      deleteTargetEvidence: {
        success: true,
        __args: {
          id: targetEvidence.id,
        },
      },
    });

    expect(deleted.deleteTargetEvidence.success).toBeTruthy();
  });

  it('throws not found when delete by wrong id', () => {
    expectNotFoundError(
      client.mutation({
        deleteTargetEvidence: {
          success: true,
          __args: {
            id: v4(),
          },
        },
      }),
    );
  });

  it('gets by id', async () => {
    const target = await testCreateTarget();
    const photos = [
      {
        url: nanoid(),
        caption: nanoid(),
      },
    ];

    const note = nanoid();
    const investigatedDate = new Date();
    const targetEvidence = (
      await client.mutation({
        createTargetEvidence: {
          __scalar: true,
          investigatedDate: true,
          evidence: {
            photos: {
              url: true,
              caption: true,
            },
            __scalar: true,
          },
          __args: {
            targetId: target.id,
            investigatedDate,
            note,
            evidence: {
              photos,
            },
          },
        },
      })
    ).createTargetEvidence;

    const result = (
      await client.query({
        getTargetEvidenceById: {
          __scalar: true,
          investigatedDate: true,
          evidence: {
            photos: {
              url: true,
              caption: true,
            },
            __scalar: true,
          },
          __args: {
            id: targetEvidence.id,
          },
        },
      })
    ).getTargetEvidenceById;

    expect(result.targetId).toEqual(target.id);
    expect(result.note).toEqual(targetEvidence.note);
    expect(result.investigatedDate).toBeDefined();
    expect(result.evidence.photos).toEqual(targetEvidence.evidence.photos);
  });

  it('throws not found when get by wrong id', () => {
    expectNotFoundError(
      client.query({
        getTargetEvidenceById: {
          __scalar: true,
          investigatedDate: true,
          evidence: {
            photos: {
              url: true,
              caption: true,
            },
            __scalar: true,
          },
          __args: {
            id: v4(),
          },
        },
      }),
    );
  });

  it('gets by target id', async () => {
    const target = await testCreateTarget();
    const photos = [
      {
        url: nanoid(),
        caption: nanoid(),
      },
    ];

    const note = nanoid();
    const investigatedDate = new Date();
    const targetEvidence = (
      await client.mutation({
        createTargetEvidence: {
          __scalar: true,
          investigatedDate: true,
          evidence: {
            photos: {
              url: true,
              caption: true,
            },
            __scalar: true,
          },
          __args: {
            targetId: target.id,
            investigatedDate,
            note,
            evidence: {
              photos,
            },
          },
        },
      })
    ).createTargetEvidence;

    const result = (
      await client.query({
        getTargetEvidenceByTargetId: {
          __scalar: true,
          investigatedDate: true,
          evidence: {
            photos: {
              url: true,
              caption: true,
            },
            __scalar: true,
          },
          __args: {
            targetId: targetEvidence.targetId,
          },
        },
      })
    ).getTargetEvidenceByTargetId;

    const targetEvidenceResult = result[0];

    expect(result).toHaveLength(1);
    expect(targetEvidenceResult.targetId).toEqual(target.id);
    expect(targetEvidenceResult.note).toEqual(targetEvidence.note);
    expect(targetEvidenceResult.investigatedDate).toBeDefined();
    expect(targetEvidenceResult.evidence.photos).toEqual(
      targetEvidence.evidence.photos,
    );
  });
});
