import { MOCK_GRAPHQL_CONTEXT } from '@tadchud-erp/graphql';
import {
  Client,
  expectNotFoundError,
  expectRoleError,
  getAdminClient,
  getUserClient,
} from '@tadchud-erp/test';
import { nanoid } from 'nanoid';

import {
  FeatureFlagService,
  WorkspaceFeatureflagService,
} from '../feature-flag/feature-flag.service';

describe('Feature flag', () => {
  const service = new FeatureFlagService(MOCK_GRAPHQL_CONTEXT);

  it('creates new', async () => {
    const flag = nanoid();
    const featureFlag = await service.create(flag);
    expect(flag).toEqual(featureFlag.flag);
  });

  it('deletes an existing', async () => {
    const flag = nanoid();
    const featureFlag = await service.create(flag);
    const result = await service.delete(featureFlag.flag);
    expect(result.flag).toEqual(featureFlag.flag);
  });

  it('throws error when delete wrong flag', async () => {
    expectNotFoundError(service.delete('featureFlag.flag'));
  });
});

describe('Workspace feature flag', () => {
  const service = new WorkspaceFeatureflagService({
    ...MOCK_GRAPHQL_CONTEXT,
    workspaceId: 1,
  });
  const featureFlagService = new FeatureFlagService({
    ...MOCK_GRAPHQL_CONTEXT,
    workspaceId: 1,
  });

  it('creates new workspace feature flag', async () => {
    const flag = nanoid();
    const featureFlag = await featureFlagService.create(flag);
    const workspaceFeatureFlag = await service.create({
      workspaceId: '1',
      flag: featureFlag.flag,
    });
    expect(workspaceFeatureFlag.featureFlagId).toEqual(featureFlag.flag);
    expect(workspaceFeatureFlag.workspaceId).toEqual(1);
  });

  it('deletes an existing', async () => {
    const flag = nanoid();
    const featureFlag = await featureFlagService.create(flag);
    await service.create({
      workspaceId: '1',
      flag: featureFlag.flag,
    });
    const workspaceFeatureFlag = await service.delete({
      featureFlagId: featureFlag.flag,
      workspaceId: '1',
    });
    expect(workspaceFeatureFlag.featureFlagId).toEqual(featureFlag.flag);
  });

  it('gets feature flags', async () => {
    const flag = nanoid();
    const featureFlag = await featureFlagService.create(flag);
    await service.create({
      workspaceId: '1',
      flag: featureFlag.flag,
    });

    const featureFlags = await service.findMany({ workspaceId: '1' });
    expect(
      featureFlags.some((f) => f.featureFlagId === featureFlag.flag)
    ).toBeTruthy();
  });
});

describe('e2e feature flag', () => {
  let adminClient: Client;
  let userClient: Client;

  beforeAll(async () => {
    adminClient = await getAdminClient();
    userClient = await getUserClient();
  });

  it('throws forbidden error when create', () => {
    expectRoleError(
      userClient.mutation({
        createFeatureFlag: {
          __scalar: true,
          __args: {
            flag: nanoid(),
          },
        },
      })
    );
  });

  it('creates new flag', async () => {
    const flag = nanoid();
    const flagResult = await adminClient.mutation({
      createFeatureFlag: {
        __scalar: true,
        __args: {
          flag,
        },
      },
    });

    expect(flag).toEqual(flagResult.createFeatureFlag.flag);
  });

  it('throws role error when delete', async () => {
    expectRoleError(
      userClient.mutation({
        deleteFeatureFlag: {
          __scalar: true,
          __args: {
            flag: nanoid(),
          },
        },
      })
    );
  });

  it('deletes an existing', async () => {
    const flag = nanoid();
    await adminClient.mutation({
      createFeatureFlag: {
        __scalar: true,
        __args: {
          flag,
        },
      },
    });

    const deletedFeatureFlag = await adminClient.mutation({
      deleteFeatureFlag: {
        __scalar: true,
        __args: {
          flag,
        },
      },
    });
    expect(deletedFeatureFlag.deleteFeatureFlag.success).toBeTruthy();
  });
});

describe('e2e workspace feature flag', () => {
  let adminClient: Client;
  let userClient: Client;

  beforeAll(async () => {
    adminClient = await getAdminClient();
    userClient = await getUserClient();
  });

  it('throws role error when create', () => {
    expectRoleError(
      userClient.mutation({
        createWorkspaceFeatureFlag: {
          __scalar: true,
          __args: {
            workspaceId: '1',
            flag: 'Flag',
          },
        },
      })
    );
  });

  it('creates new', async () => {
    const flag = nanoid();
    const createdFlag = await adminClient.mutation({
      createFeatureFlag: {
        __scalar: true,
        __args: {
          flag,
        },
      },
    });

    const createdWorkspaceFeatureflag = await adminClient.mutation({
      createWorkspaceFeatureFlag: {
        __scalar: true,
        __args: {
          workspaceId: '1',
          flag: createdFlag.createFeatureFlag.flag,
        },
      },
    });

    expect(
      createdWorkspaceFeatureflag.createWorkspaceFeatureFlag.featureFlagId
    ).toEqual(flag);
  });

  it('throws role error when delete', () => {
    expectRoleError(
      userClient.mutation({
        deleteWorkspaceFeatureFlag: {
          __scalar: true,
          __args: {
            workspaceId: '1',
            featureFlagId: 'Flag',
          },
        },
      })
    );
  });

  it('deletes an existing', async () => {
    const flag = nanoid();
    const createdFlag = await adminClient.mutation({
      createFeatureFlag: {
        __scalar: true,
        __args: {
          flag,
        },
      },
    });

    const createdWorkspaceFeatureflag = await adminClient.mutation({
      createWorkspaceFeatureFlag: {
        __scalar: true,
        __args: {
          workspaceId: '1',
          flag: createdFlag.createFeatureFlag.flag,
        },
      },
    });

    const deletedResult = await adminClient.mutation({
      deleteWorkspaceFeatureFlag: {
        __scalar: true,
        __args: {
          workspaceId: '1',
          featureFlagId:
            createdWorkspaceFeatureflag.createWorkspaceFeatureFlag
              .featureFlagId,
        },
      },
    });

    expect(deletedResult.deleteWorkspaceFeatureFlag.success).toBeTruthy();
  });
});
