import { client } from './client';
import {
  FEATURE_FLAG_PERMISSION_IDS,
  MISSION_PERMISSIONS,
  TARGET_PERMISSIONS,
} from './constants';

export async function seedPermissionAbilities() {
  await client.permission.createMany({
    data: [
      {
        action: 'CREATE',
        subject: 'TEST',
      },
      {
        action: 'READ',
        subject: 'TEST',
      },
      {
        action: 'DELETE',
        subject: 'TEST',
      },
      {
        action: 'UPDATE',
        subject: 'TEST',
      },
      {
        id: FEATURE_FLAG_PERMISSION_IDS.CREATE,
        action: 'CREATE',
        subject: 'FEATURE_FLAG',
      },
      {
        id: FEATURE_FLAG_PERMISSION_IDS.READ,
        action: 'READ',
        subject: 'FEATURE_FLAG',
      },
      {
        id: FEATURE_FLAG_PERMISSION_IDS.UPDATE,
        action: 'UPDATE',
        subject: 'FEATURE_FLAG',
      },
      {
        id: FEATURE_FLAG_PERMISSION_IDS.DELETE,
        action: 'DELETE',
        subject: 'FEATURE_FLAG',
      },
      ...TARGET_PERMISSIONS,
      ...MISSION_PERMISSIONS,
    ],
  });
}
