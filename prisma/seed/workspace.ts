import { client } from './client';
import { nanoid } from 'nanoid';
import { TEST_USER_ID } from './constants';

export async function seedWorkspace() {
  const workspace = await client.workspace.create({
    data: {
      id: 1,
      ownerId: 1,
      title: nanoid(),
      slug: nanoid(),
      createdBy: TEST_USER_ID,
      updatedBy: TEST_USER_ID,
    },
  });

  console.log('create workspace', workspace);
}
