import { client } from './client';
import { FEATURE_FLAG_PERMISSION_IDS, auditFields } from './constants';

export async function seedPermissionAbilities() {
  await client.permissionAbility.createMany({
    data: [
      {
        action: 'CREATE',
        subject: 'TEST',
        ...auditFields,
      },
      {
        action: 'READ',
        subject: 'TEST',
        ...auditFields,
      },
      {
        action: 'DELETE',
        subject: 'TEST',
        ...auditFields,
      },
      {
        action: 'UPDATE',
        subject: 'TEST',
        ...auditFields,
      },
      {
        id: FEATURE_FLAG_PERMISSION_IDS.CREATE,
        action: 'CREATE',
        subject: 'FEATURE_FLAG',
        ...auditFields,
      },
      {
        id: FEATURE_FLAG_PERMISSION_IDS.READ,
        action: 'READ',
        subject: 'FEATURE_FLAG',
        ...auditFields,
      },
      {
        id: FEATURE_FLAG_PERMISSION_IDS.UPDATE,
        action: 'UPDATE',
        subject: 'FEATURE_FLAG',
        ...auditFields,
      },
      {
        id: FEATURE_FLAG_PERMISSION_IDS.DELETE,
        action: 'DELETE',
        subject: 'FEATURE_FLAG',
        ...auditFields,
      },
    ],
  });
}
