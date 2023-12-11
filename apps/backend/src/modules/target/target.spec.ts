import { Client, getAdminClient } from '@cell-mon/graphql-client';
import {
  expectDuplicatedError,
  expectNotFoundError,
  testCreateTarget,
} from '@cell-mon/test';
import { nanoid } from 'nanoid';
import { v4 } from 'uuid';

import { Priority } from '../../codegen-generated';

describe('Target', () => {
  let client: Client;
  beforeAll(async () => {
    client = await getAdminClient();
  });

  it('creates', async () => {
    const title = nanoid();
    const description = nanoid();
    const tags = [nanoid(), nanoid()];
    const photoKey = nanoid();

    const target = (
      await client.mutation({
        createTarget: {
          __scalar: true,
          tags: true,
          __args: {
            title,
            tags,
            description,
            photoKey,
          },
        },
      })
    ).createTarget;
    expect(target.id).toBeDefined();
    expect(target.description).toEqual(description);
    expect(target.photoUrl).toEqual(photoKey);
    expect(target.priority).toBe(Priority.Medium);
    expect(target.tags).toEqual(tags);
  });

  it('throws duplicate title when create new with duplicated title', async () => {
    const title = nanoid();
    const description = nanoid();
    const tags = [nanoid(), nanoid()];
    const photoKey = nanoid();

    await client.mutation({
      createTarget: {
        __scalar: true,
        tags: true,
        __args: {
          title,
          tags,
          description,
          photoKey,
        },
      },
    });

    expectDuplicatedError(
      client.mutation({
        createTarget: {
          __scalar: true,
          tags: true,
          __args: {
            title,
            tags,
            description,
            photoKey,
          },
        },
      }),
    );
  });

  it('updates an existing', async () => {
    const title = nanoid();
    const description = nanoid();
    const tags = [nanoid(), nanoid()];
    const photoKey = nanoid();

    const target = (
      await client.mutation({
        createTarget: {
          __scalar: true,
          tags: true,
          __args: {
            title,
            tags,
            description,
            photoKey,
          },
        },
      })
    ).createTarget;

    const newTitle = nanoid();
    const newTags = [nanoid(), nanoid()];
    const updatedTarget = (
      await client.mutation({
        updateTarget: {
          __scalar: true,
          tags: true,
          __args: {
            id: target.id,
            title: newTitle,
            tags: newTags,
            description,
            photoKey,
          },
        },
      })
    ).updateTarget;

    expect(updatedTarget.id).toEqual(target.id);
    expect(updatedTarget.title).toEqual(newTitle);
    expect(updatedTarget.tags).toEqual(newTags);
  });

  it('throws duplicated title when update with duplicated title', async () => {
    const title = nanoid();
    const description = nanoid();
    const tags = [nanoid(), nanoid()];
    const photoKey = nanoid();

    await client.mutation({
      createTarget: {
        __scalar: true,
        tags: true,
        __args: {
          title,
          tags,
          description,
          photoKey,
        },
      },
    });

    const duplicatedTarget = (
      await client.mutation({
        createTarget: {
          __scalar: true,
          tags: true,
          __args: {
            title: nanoid(),
            tags,
            description,
            photoKey,
          },
        },
      })
    ).createTarget;

    expectDuplicatedError(
      client.mutation({
        updateTarget: {
          __scalar: true,
          tags: true,
          __args: {
            id: duplicatedTarget.id,
            title,
            tags,
            description,
            photoKey,
          },
        },
      }),
    );
  });

  it('gets by id', async () => {
    const title = nanoid();
    const description = nanoid();
    const tags = [nanoid(), nanoid()];
    const photoKey = nanoid();

    const createdTarget = (
      await client.mutation({
        createTarget: {
          __scalar: true,
          tags: true,
          __args: {
            title,
            tags,
            description,
            photoKey,
          },
        },
      })
    ).createTarget;

    const target = await client.query({
      getTargetById: {
        __scalar: true,
        __args: {
          id: createdTarget.id,
        },
      },
    });

    expect(target.getTargetById).toEqual(createdTarget);
  });

  it('throws not found when get by wrong id', () => {
    expectNotFoundError(
      client.query({
        getTargetById: {
          __scalar: true,
          __args: {
            id: v4(),
          },
        },
      }),
    );
  });

  it('throws not found when get by deleted id', async () => {
    const title = nanoid();
    const description = nanoid();
    const tags = [nanoid(), nanoid()];
    const photoKey = nanoid();

    const createdTarget = (
      await client.mutation({
        createTarget: {
          __scalar: true,
          tags: true,
          __args: {
            title,
            tags,
            description,
            photoKey,
          },
        },
      })
    ).createTarget;

    await client.mutation({
      deleteTarget: {
        __scalar: true,
        __args: {
          id: createdTarget.id,
        },
      },
    });

    expectNotFoundError(
      client.query({
        getTargetById: {
          __scalar: true,
          __args: {
            id: createdTarget.id,
          },
        },
      }),
    );
  });

  it('deletes an existing', async () => {
    const title = nanoid();
    const description = nanoid();
    const tags = [nanoid(), nanoid()];
    const photoKey = nanoid();

    const createdTarget = (
      await client.mutation({
        createTarget: {
          __scalar: true,
          tags: true,
          __args: {
            title,
            tags,
            description,
            photoKey,
          },
        },
      })
    ).createTarget;

    const deleted = await client.mutation({
      deleteTarget: {
        __scalar: true,
        __args: {
          id: createdTarget.id,
        },
      },
    });

    expect(deleted.deleteTarget.success).toBeTruthy();
    expectNotFoundError(
      client.query({
        getTargetById: {
          __scalar: true,
          __args: {
            id: createdTarget.id,
          },
        },
      }),
    );
  });

  it('throws not found when delete by wrong id', () => {
    expectNotFoundError(
      client.mutation({
        deleteTarget: {
          __scalar: true,
          __args: {
            id: v4(),
          },
        },
      }),
    );
  });

  it('gets by title', async () => {
    const title = nanoid();
    const description = nanoid();
    const tags = [nanoid(), nanoid()];
    const photoKey = nanoid();

    const createdTarget = (
      await client.mutation({
        createTarget: {
          __scalar: true,
          tags: true,
          __args: {
            title,
            tags,
            description,
            photoKey,
          },
        },
      })
    ).createTarget;

    const targets = await client.query({
      getTargets: {
        __scalar: true,
        __args: {
          search: title.toLowerCase(),
        },
      },
    });

    expect(targets.getTargets[0]).toEqual(createdTarget);
  });

  it('gets by priority', async () => {
    const title = nanoid();
    const description = nanoid();
    const tags = [nanoid(), nanoid(), nanoid(), nanoid()];
    const photoKey = nanoid();

    await client.mutation({
      createTarget: {
        __scalar: true,
        tags: true,
        __args: {
          title,
          tags,
          description,
          photoKey,
          priority: 'LOW',
        },
      },
    });

    const targets = await client.query({
      getTargets: {
        __scalar: true,
        __args: {
          priorities: ['LOW'],
        },
      },
    });

    expect(
      targets.getTargets.every((target) => target.priority === 'LOW'),
    ).toBeTruthy();
  });

  it('gets by tags', async () => {
    const title = nanoid();
    const description = nanoid();
    const tags = [nanoid(), nanoid(), nanoid(), nanoid()];
    const photoKey = nanoid();

    const createdTarget = (
      await client.mutation({
        createTarget: {
          __scalar: true,
          tags: true,
          __args: {
            title,
            tags,
            description,
            photoKey,
          },
        },
      })
    ).createTarget;

    const targets = await client.query({
      getTargets: {
        __scalar: true,
        __args: {
          tags: [tags[1], tags[3]],
        },
      },
    });
    expect(targets.getTargets.length).toEqual(1);
    expect(targets.getTargets[0]).toEqual(createdTarget);
  });

  it('gets evidences by field resolver', async () => {
    const target = await testCreateTarget();
    const photos = [
      {
        key: nanoid(),
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

    const targetEvidenceResult = (
      await client.query({
        getTargetById: {
          __scalar: true,
          evidences: {
            __scalar: true,
            investigatedDate: true,
            evidence: {
              photos: {
                url: true,
                caption: true,
              },
            },
          },
          __args: {
            id: target.id,
          },
        },
      })
    ).getTargetById.evidences;
    expect(targetEvidenceResult).toHaveLength(1);
    expect(targetEvidenceResult[0].targetId).toEqual(target.id);
    expect(targetEvidenceResult[0].note).toEqual(targetEvidence.note);
    expect(targetEvidenceResult[0].investigatedDate).toBeDefined();
    expect(targetEvidenceResult[0].evidence.photos).toEqual(
      targetEvidence.evidence.photos,
    );
  });
});
