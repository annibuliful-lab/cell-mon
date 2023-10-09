import { PermissionAction } from '@prisma/client';

export const auditFields = {
  createdBy: 'TEST_USER',
  updatedBy: 'TEST_USER',
};

export const TEST_USER_A_ID = 'b9d30728-b813-468f-860a-c9c4ce43bc8b';
export const TEST_USER_B_ID = '36c50b6d-5d02-4415-95b1-b859e08236e1';
export const TEST_ADMIN_ID = '8826b79b-e40d-406d-874e-153101729f78';

export const TEST_PERMISSION_ID = '3a684496-0b9e-4334-9de4-dff22b91100a';

export const WORKSPACE_ID = 'd1cd8256-696e-41fa-bb7b-306d2f2a216e';
export const WORKSPACE_A_ID = 'cbd52eee-7f90-4359-bc41-f98ee3e1a430';

export const FEATURE_FLAG_PERMISSION_IDS = {
  CREATE: '5134180b-c9c6-4c59-ae6a-6884a8258fe3',
  UPDATE: '336e0573-83c2-4ae2-a1bb-f5714f60686e',
  READ: '8b9bd245-a2f7-4d4a-9fb3-8be2807fd98f',
  DELETE: 'ed9c034f-ace9-4b22-b135-9db2ad231f72',
};

export const PERMISSION_ABILITILES = [
  PermissionAction.CREATE,
  PermissionAction.DELETE,
  PermissionAction.READ,
  PermissionAction.UPDATE,
];

export const TARGET_PERMISSIONS = PERMISSION_ABILITILES.map((action) => ({
  action,
  subject: 'TARGET',
}));

export const MISSION_PERMISSIONS = PERMISSION_ABILITILES.map((action) => ({
  action,
  subject: 'MISSION',
}));
