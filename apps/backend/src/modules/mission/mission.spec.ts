import { Client, getAdminClient } from '@cell-mon/test';
import { nanoid } from 'nanoid';

import { MissionStatus } from '../../codegen-generated';

describe('Mission', () => {
  let client: Client;

  beforeAll(async () => {
    client = await getAdminClient();
  });

  it('creates new', async () => {
    const name = nanoid();
    const description = nanoid();
    const mission = await client.mutation({
      createMission: {
        __scalar: true,
        __args: {
          name,
          description,
        },
      },
    });

    expect(mission.createMission.name).toEqual(name);
    expect(mission.createMission.description).toEqual(description);
    expect(mission.createMission.status).toEqual(MissionStatus.Draft);
  });
});
