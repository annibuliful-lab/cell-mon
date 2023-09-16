import { inspect } from 'util';
import { client } from './client';

export async function seedMessageGroups() {
  const groupA = await client.messageGroup.create({
    data: {
      id: 1,
      title: 'groupA',
      createdBy: 'SYSTEM',
      updatedBy: 'SYSTEM',
    },
  });

  console.log('created message group', inspect({ groupA }, false, null, true));
}

export async function seedMessageGroupMembers() {
  const groupA = await client.messageGroupMember.create({
    data: {
      accountId: 1,
      messageGroupId: 1,
      role: 'OWNER',
      createdBy: 'SYSTEM',
      updatedBy: 'SYSTEM',
    },
  });

  console.log(
    'created message group member',
    inspect({ groupA }, false, null, true)
  );
}
