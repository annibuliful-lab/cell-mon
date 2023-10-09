import {
  Client,
  getAdminClient,
  getUserClient,
} from '@cell-mon/graphql-client';
import {
  expectForbiddenError,
  expectNotFoundError,
  testCreatePhoneMetadata,
  testCreateTarget,
} from '@cell-mon/test';
import { v4 } from 'uuid';

describe('Phone Target', () => {
  let client: Client;

  beforeAll(async () => {
    client = await getAdminClient();
  });

  it('assign new', async () => {
    const target = await testCreateTarget();
    const phone = await testCreatePhoneMetadata();
    const phoneTarget = (
      await client.mutation({
        assignPhoneToTarget: {
          __scalar: true,
          __args: {
            phoneId: phone.id,
            targetId: target.id,
          },
        },
      })
    ).assignPhoneToTarget;

    expect(phoneTarget.phoneId).toEqual(phone.id);
    expect(phoneTarget.targetId).toEqual(target.id);
  });

  it('throws not found by not existing target id', async () => {
    const phone = await testCreatePhoneMetadata();

    expectNotFoundError(
      client.mutation({
        assignPhoneToTarget: {
          __scalar: true,
          __args: {
            phoneId: phone.id,
            targetId: v4(),
          },
        },
      }),
    );
  });

  it('throws forbidden when assign to forbidden target', async () => {
    const userAClient = await getUserClient();
    const target = await testCreateTarget();
    const phone = await testCreatePhoneMetadata();

    expectForbiddenError(
      userAClient.mutation({
        assignPhoneToTarget: {
          __scalar: true,
          __args: {
            phoneId: phone.id,
            targetId: target.id,
          },
        },
      }),
    );
  });

  it('bulk assign phones', async () => {
    const target = await testCreateTarget();
    const phone = await testCreatePhoneMetadata();
    const phoneTarget = (
      await client.mutation({
        bulkAssignPhonesToTarget: {
          __scalar: true,
          __args: {
            phoneIds: [phone.id],
            targetId: target.id,
          },
        },
      })
    ).bulkAssignPhonesToTarget;

    expect(phoneTarget).toHaveLength(1);
    expect(phoneTarget[0].phoneId).toEqual(phone.id);
    expect(phoneTarget[0].targetId).toEqual(target.id);
  });

  it('unassign an existing', async () => {
    const target = await testCreateTarget();
    const phone = await testCreatePhoneMetadata();
    const assignedPhoneTarget = (
      await client.mutation({
        assignPhoneToTarget: {
          __scalar: true,
          __args: {
            phoneId: phone.id,
            targetId: target.id,
          },
        },
      })
    ).assignPhoneToTarget;

    const unassignPhoneTarget = (
      await client.mutation({
        unassignPhoneFromTarget: {
          __scalar: true,
          __args: {
            id: assignedPhoneTarget.id,
          },
        },
      })
    ).unassignPhoneFromTarget;

    expect(unassignPhoneTarget.success).toBeTruthy();
  });

  it('throws not found when unassign by wrong id', () => {
    expectNotFoundError(
      client.mutation({
        unassignPhoneFromTarget: {
          __scalar: true,
          __args: {
            id: v4(),
          },
        },
      }),
    );
  });

  it('gets by id', async () => {
    const target = await testCreateTarget();
    const phone = await testCreatePhoneMetadata();
    const created = (
      await client.mutation({
        assignPhoneToTarget: {
          __scalar: true,
          __args: {
            phoneId: phone.id,
            targetId: target.id,
          },
        },
      })
    ).assignPhoneToTarget;

    const phoneTarget = (
      await client.query({
        getPhoneTargetById: {
          __scalar: true,
          __args: {
            id: created.id,
          },
        },
      })
    ).getPhoneTargetById;

    expect(phoneTarget.phoneId).toEqual(phone.id);
    expect(phoneTarget.targetId).toEqual(target.id);
  });

  it('gets by target id', async () => {
    const target = await testCreateTarget();
    const phone = await testCreatePhoneMetadata();
    const created = (
      await client.mutation({
        assignPhoneToTarget: {
          __scalar: true,
          __args: {
            phoneId: phone.id,
            targetId: target.id,
          },
        },
      })
    ).assignPhoneToTarget;

    const phoneTargets = (
      await client.query({
        getPhoneTargetsByTargetId: {
          __scalar: true,
          phone: {
            __scalar: true,
          },
          __args: {
            targetId: created.targetId,
          },
        },
      })
    ).getPhoneTargetsByTargetId;

    expect(phoneTargets).toHaveLength(1);
    expect(phoneTargets[0].phone).toEqual(phone);
    expect(phoneTargets[0].phoneId).toEqual(phone.id);
    expect(phoneTargets[0].targetId).toEqual(target.id);
  });
});
