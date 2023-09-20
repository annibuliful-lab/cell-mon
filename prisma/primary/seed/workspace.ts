import { client } from './client';
import { nanoid } from 'nanoid';
import { TEST_USER_ID } from './constants';
import { v4 } from 'uuid';

export async function seedWorkspace() {
  const workspace = await client.workspace.create({
    data: {
      id: v4(),
      title: nanoid(),
      createdBy: TEST_USER_ID,
      updatedBy: TEST_USER_ID,
    },
  });

  console.log('create workspace', workspace);
}
