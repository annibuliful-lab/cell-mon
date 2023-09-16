import { client } from './client';
import { FEATURE_FLAG_PERMISSION_IDS, TEST_USER_ID } from './constants';

export async function seedProjects() {
  const project = await client.project.create({
    data: {
      id: 1,
      workspaceId: 1,
      title: 'ADMIN_PROJECT',
      description: '',
      pricingPlanId: 1,
      slug: 'admin-project',
      type: 'Engineering',
      logo: 'logo',
      createdBy: TEST_USER_ID,
      updatedBy: TEST_USER_ID,
    },
  });

  console.log('project', project);
}

export async function seedProjectRoles() {
  const projectRole = await client.projectRole.create({
    data: {
      id: 1,
      projectId: 1,
      title: 'KeyAdmin',
      createdBy: TEST_USER_ID,
      updatedBy: TEST_USER_ID,
    },
  });

  console.log('project role', projectRole);
}

export async function seedProjectAccounts() {
  const projectAccount = await client.projectAccount.create({
    data: {
      id: 1,
      roleId: 1,
      projectId: 1,
      accountId: 2,
      createdBy: TEST_USER_ID,
      updatedBy: TEST_USER_ID,
    },
  });

  console.log('project account', projectAccount);
}

export async function seedProjectRolePermission() {
  const projectRolePermissions = await Promise.all(
    Object.values(FEATURE_FLAG_PERMISSION_IDS).map((value, index) =>
      client.projectRolePermission.create({
        data: {
          id: index + 1,
          roleId: 1,
          permissionAbilityId: value,
          createdBy: TEST_USER_ID,
          updatedBy: TEST_USER_ID,
        },
      })
    )
  );
  console.log('project role permission', projectRolePermissions);
}
