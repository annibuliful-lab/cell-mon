import {
  Client,
  expectDuplicatedError,
  expectNotFoundError,
  getAdminClient,
} from '@cell-mon/test';
import { nanoid } from 'nanoid';
import { v4 } from 'uuid';

import { MissionStatus } from '../../codegen-generated';

describe('Mission', () => {
  let client: Client;

  beforeAll(async () => {
    client = await getAdminClient();
  });

  it('creates new', async () => {
    const title = nanoid();
    const description = nanoid();
    const mission = await client.mutation({
      createMission: {
        __scalar: true,
        __args: {
          title,
          description,
        },
      },
    });

    expect(mission.createMission.title).toEqual(title);
    expect(mission.createMission.description).toEqual(description);
    expect(mission.createMission.status).toEqual(MissionStatus.Draft);
  });

  it('throws duplicated title', async () => {
    const title = nanoid();
    const description = nanoid();
    await client.mutation({
      createMission: {
        __scalar: true,
        __args: {
          title,
          description,
        },
      },
    });

    expectDuplicatedError(
      client.mutation({
        createMission: {
          __scalar: true,
          __args: {
            title,
            description,
          },
        },
      })
    );
  });

  it('does not throw duplicated title when create with deleted mission title', async () => {
    const title = nanoid();
    const description = nanoid();
    const deleteMission = await client.mutation({
      createMission: {
        __scalar: true,
        __args: {
          title,
          description,
        },
      },
    });

    await client.mutation({
      deleteMission: {
        __scalar: true,
        __args: {
          id: deleteMission.createMission.id,
        },
      },
    });

    const mission = await client.mutation({
      createMission: {
        __scalar: true,
        __args: {
          title,
          description,
        },
      },
    });

    expect(mission.createMission.title).toEqual(title);
    expect(mission.createMission.description).toEqual(description);
    expect(mission.createMission.status).toEqual(MissionStatus.Draft);
  });

  it('update an existing', async () => {
    const title = nanoid();
    const description = nanoid();
    const mission = await client.mutation({
      createMission: {
        __scalar: true,
        __args: {
          title: nanoid(),
          description: nanoid(),
        },
      },
    });

    const updatedMission = await client.mutation({
      updateMission: {
        __scalar: true,
        __args: {
          id: mission.createMission.id,
          title,
          description,
          status: MissionStatus.Investigating,
        },
      },
    });

    expect(updatedMission.updateMission.id).toEqual(mission.createMission.id);
    expect(updatedMission.updateMission.title).toEqual(title);
    expect(updatedMission.updateMission.description).toEqual(description);
    expect(updatedMission.updateMission.status).toEqual(
      MissionStatus.Investigating
    );
  });

  it('throws duplicated when update with duplicated title', async () => {
    const description = nanoid();
    const duplicatedTitle = nanoid();

    await client.mutation({
      createMission: {
        __scalar: true,
        __args: {
          title: duplicatedTitle,
          description: nanoid(),
        },
      },
    });

    const duplicatedTitleMission = await client.mutation({
      createMission: {
        __scalar: true,
        __args: {
          title: nanoid(),
          description: nanoid(),
        },
      },
    });

    expectDuplicatedError(
      client.mutation({
        updateMission: {
          __scalar: true,
          __args: {
            id: duplicatedTitleMission.createMission.id,
            title: duplicatedTitle,
            description,
            status: MissionStatus.Investigating,
          },
        },
      })
    );
  });

  it('throws not found when update', () => {
    expectNotFoundError(
      client.mutation({
        updateMission: {
          __scalar: true,
          __args: {
            id: v4(),
            title: nanoid(),
            description: nanoid(),
            status: MissionStatus.Investigating,
          },
        },
      })
    );
  });

  it('delete an existing', async () => {
    const title = nanoid();
    const description = nanoid();

    const mission = await client.mutation({
      createMission: {
        __scalar: true,
        __args: {
          title,
          description,
        },
      },
    });

    const deleted = await client.mutation({
      deleteMission: {
        __scalar: true,
        __args: {
          id: mission.createMission.id,
        },
      },
    });

    expect(deleted.deleteMission.success).toBeTruthy();
  });
});
