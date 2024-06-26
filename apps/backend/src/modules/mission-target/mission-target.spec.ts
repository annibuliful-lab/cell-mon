import { Client, getAdminClient } from '@cell-mon/graphql-client';
import { testCreateMission, testCreateTarget } from '@cell-mon/test';

describe('Mission Target', () => {
  let client: Client;
  beforeAll(async () => {
    client = await getAdminClient();
  });

  it('assign single target', async () => {
    const mission = await testCreateMission();
    const target = await testCreateTarget();
    const missionTarget = (
      await client.mutation({
        assignTargetToMission: {
          __scalar: true,
          __args: {
            missionId: mission.id,
            targetId: target.id,
          },
        },
      })
    ).assignTargetToMission;

    expect(missionTarget.missionId).toEqual(mission.id);
    expect(missionTarget.targetId).toEqual(target.id);
  });

  it('unassign single target', async () => {
    const mission = await testCreateMission();
    const target = await testCreateTarget();
    const missionTarget = (
      await client.mutation({
        assignTargetToMission: {
          __scalar: true,
          __args: {
            missionId: mission.id,
            targetId: target.id,
          },
        },
      })
    ).assignTargetToMission;

    const result = (
      await client.mutation({
        unassignTargetFromMission: {
          __scalar: true,
          ids: true,
          __args: {
            id: missionTarget.id,
          },
        },
      })
    ).unassignTargetFromMission;

    expect(result.success).toBeTruthy();
    expect(result.ids[0]).toEqual(missionTarget.id);
  });

  it('bulk assign targets', async () => {
    const mission = await testCreateMission();
    const targets = await Promise.all([testCreateTarget(), testCreateTarget()]);
    const targetIds = targets.map((t) => t.id);

    const result = (
      await client.mutation({
        bulkAssignTargetsToMission: {
          __scalar: true,
          __args: {
            missionId: mission.id,
            targetIds,
          },
        },
      })
    ).bulkAssignTargetsToMission;

    expect(
      result.every(
        (result) =>
          targetIds.includes(result.targetId) &&
          result.missionId === mission.id,
      ),
    ).toBeTruthy();
  });

  it('bulk unassign targets', async () => {
    const mission = await testCreateMission();
    const targets = await Promise.all([testCreateTarget(), testCreateTarget()]);
    const targetIds = targets.map((t) => t.id);

    const bulkAssigned = (
      await client.mutation({
        bulkAssignTargetsToMission: {
          __scalar: true,
          __args: {
            missionId: mission.id,
            targetIds,
          },
        },
      })
    ).bulkAssignTargetsToMission;

    const bulkAssignedIds = bulkAssigned.map((e) => e.id);
    const result = await client.mutation({
      bulkUnassignTargetsFromMission: {
        __scalar: true,
        ids: true,
        __args: {
          ids: bulkAssignedIds,
        },
      },
    });

    expect(result.bulkUnassignTargetsFromMission.success).toBeTruthy();
    expect(
      result.bulkUnassignTargetsFromMission.ids.every((id) =>
        bulkAssignedIds.includes(id),
      ),
    ).toBeTruthy();
  });

  it('gets by id', async () => {
    const mission = await testCreateMission();
    const target = await testCreateTarget();
    const missionTarget = (
      await client.mutation({
        assignTargetToMission: {
          __scalar: true,
          __args: {
            missionId: mission.id,
            targetId: target.id,
          },
        },
      })
    ).assignTargetToMission;

    const result = await client.query({
      getMissionTargetById: {
        __scalar: true,
        __args: {
          id: missionTarget.id,
        },
      },
    });

    expect(result.getMissionTargetById).toEqual(missionTarget);
  });

  it('gets by mission id', async () => {
    const mission = await testCreateMission();
    const targets = await Promise.all([testCreateTarget(), testCreateTarget()]);
    const targetIds = targets.map((t) => t.id);

    const bulkAssigned = (
      await client.mutation({
        bulkAssignTargetsToMission: {
          __scalar: true,
          __args: {
            missionId: mission.id,
            targetIds,
          },
        },
      })
    ).bulkAssignTargetsToMission;

    const result = (
      await client.query({
        getMissionTargetsByMissionId: {
          __scalar: true,
          __args: {
            missionId: mission.id,
          },
        },
      })
    ).getMissionTargetsByMissionId;

    expect(result).toEqual(bulkAssigned);
  });

  it('gets by target field', async () => {
    const mission = await testCreateMission();
    const targets = await Promise.all([
      testCreateTarget({ priority: 'CRITICAL' }),
      testCreateTarget({ priority: 'URGENT' }),
    ]);
    const targetIds = targets.map((t) => t.id);

    await client.mutation({
      bulkAssignTargetsToMission: {
        __scalar: true,
        __args: {
          missionId: mission.id,
          targetIds,
        },
      },
    });

    const result = (
      await client.query({
        getMissionTargetsByMissionId: {
          __scalar: true,
          target: {
            __scalar: true,
          },
          __args: {
            missionId: mission.id,
            targetPriorities: ['CRITICAL', 'URGENT'],
          },
        },
      })
    ).getMissionTargetsByMissionId;

    expect(result.map((el) => el.target)).toEqual(
      expect.arrayContaining(targets),
    );
  });

  it('gets by target priority', async () => {
    const mission = await testCreateMission();
    const targets = await Promise.all([
      testCreateTarget({ priority: 'CRITICAL' }),
      testCreateTarget({ priority: 'URGENT' }),
    ]);
    const targetIds = targets.map((t) => t.id);

    await client.mutation({
      bulkAssignTargetsToMission: {
        __scalar: true,
        __args: {
          missionId: mission.id,
          targetIds,
        },
      },
    });

    const result = (
      await client.query({
        getMissionTargetsByMissionId: {
          __scalar: true,
          target: {
            __scalar: true,
          },
          __args: {
            missionId: mission.id,
            targetPriorities: ['URGENT'],
          },
        },
      })
    ).getMissionTargetsByMissionId;
    expect(result).toHaveLength(1);
    expect(result[0].target).toEqual(targets[1]);
  });
});
