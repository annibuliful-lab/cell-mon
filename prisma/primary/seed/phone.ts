import { nanoid } from 'nanoid';
import { client } from './client';
import { WORKSPACE_ID } from './constants';

export async function seedPhone() {
  const completedPhone = await client.phoneMetadata.create({
    data: {
      id: '8d1d4ca4-6e32-4e43-8a05-19835472fb97',
      msisdn: {
        create: {
          id: 'e23e27b6-694b-43ff-8958-83660972c332',
          msisdn: '66957899365',
          createdBy: 'SEED',
        },
      },
      createdBy: 'SEED',
    },
  });

  const completedTarget = await client.target.create({
    data: {
      title: nanoid(),
      workspaceId: WORKSPACE_ID,
      createdBy: 'SEED',
    },
  });

  const completedPhoneTarget = await client.phoneTarget.create({
    data: {
      id: '89ac84dc-fcb0-4057-b291-fe33f43c158f',
      phoneId: completedPhone.id,
      targetId: completedTarget.id,
      createdBy: 'SEED',
    },
  });

  const failedPhone = await client.phoneMetadata.create({
    data: {
      id: '517b1d63-6401-41ed-8ced-df8faffa56ba',
      msisdn: {
        create: {
          id: '67072a2e-6df6-442b-81ec-c5677b08c78e',
          msisdn: '66832052212',
          createdBy: 'SEED',
        },
      },
      createdBy: 'SEED',
    },
  });

  const failedTarget = await client.target.create({
    data: {
      title: nanoid(),
      workspaceId: WORKSPACE_ID,
      createdBy: 'SEED',
    },
  });

  const failedPhoneTarget = await client.phoneTarget.create({
    data: {
      id: '59221f75-5034-424f-9ffa-c63ec22f369e',
      phoneId: failedPhone.id,
      targetId: failedTarget.id,
      createdBy: 'SEED',
    },
  });
}
