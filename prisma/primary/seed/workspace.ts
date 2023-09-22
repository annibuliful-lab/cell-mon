import { client } from './client';
import { nanoid } from 'nanoid';
import { TEST_USER_ID, WORKSPACE_ID } from './constants';

export async function seedWorkspace() {
  const workspace = await client.workspace.create({
    data: {
      id: WORKSPACE_ID,
      title: nanoid(),
      createdBy: TEST_USER_ID,
      updatedBy: TEST_USER_ID,
    },
  });

  console.log('create workspace', workspace);
}
