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

  it('gets by id', async () => {
    const title = nanoid();
    const description = nanoid();
    const createMission = await client.mutation({
      createMission: {
        __scalar: true,
        __args: {
          title,
          description,
        },
      },
    });

    const { getMissionById } = await client.query({
      getMissionById: {
        __args: {
          id: createMission.createMission.id,
        },
        __scalar: true,
      },
    });

    expect(getMissionById.id).toEqual(createMission.createMission.id);
  });

  it('throws not found when get by id', () => {
    expectNotFoundError(
      client.query({
        getMissionById: {
          __args: {
            id: v4(),
          },
          __scalar: true,
        },
      })
    );
  });

  it('gets by title', async () => {
    const title = nanoid();
    const description = nanoid();
    const createdMission = await client.mutation({
      createMission: {
        __scalar: true,
        __args: {
          title,
          description,
        },
      },
    });

    const missions = await client.query({
      getMissions: {
        __scalar: true,
        __args: {
          title: title.toLowerCase(),
        },
      },
    });

    const mission = missions.getMissions[0];
    expect(missions.getMissions.length).toEqual(1);
    expect(mission.title.toLowerCase()).toEqual(title.toLowerCase());
    expect(mission.id).toEqual(createdMission.createMission.id);
  });

  it('gets by status', async () => {
    const title = nanoid();
    const description = nanoid();
    const createdMission = await client.mutation({
      createMission: {
        __scalar: true,
        __args: {
          title,
          description,
        },
      },
    });

    await client.mutation({
      updateMission: {
        __scalar: true,
        __args: {
          id: createdMission.createMission.id,
          status: MissionStatus.Investigating,
        },
      },
    });

    const missions = await client.query({
      getMissions: {
        __scalar: true,
        __args: {
          status: MissionStatus.Investigating,
        },
      },
    });

    const mission = missions.getMissions[0];

    expect(mission.id).toEqual(createdMission.createMission.id);
    expect(mission.status).toEqual(MissionStatus.Investigating);
  });
});
