import { Prisma } from '@prisma/client';
import { client } from './client';
import util from 'util';
import { hash } from 'argon2';
import { TEST_ADMIN_ID, TEST_USER_B_ID, TEST_USER_A_ID } from './constants';

export const MOCK_USER_A: Prisma.AccountUncheckedCreateInput = {
  id: TEST_USER_A_ID,
  username: 'MOCK_USER_A',
  password: '12345678',
};

export const MOCK_USER_B: Prisma.AccountUncheckedCreateInput = {
  id: TEST_USER_B_ID,
  username: 'MOCK_USER_B',
  password: '12345678',
};

export const MOCK_ADMIN: Prisma.AccountUncheckedCreateInput = {
  id: TEST_ADMIN_ID,
  username: 'MOCK_ADMIN_A',
  password: '12345678',
};

export async function seedUsers() {
  await client.account.createMany({
    data: [
      {
        ...MOCK_USER_A,
        password: await hash(MOCK_USER_A.password),
      },
      {
        ...MOCK_ADMIN,
        password: await hash(MOCK_ADMIN.password),
      },
      {
        ...MOCK_USER_B,
        password: await hash(MOCK_USER_B.password),
      },
    ],
  });

  console.log(
    'created users',
    util.inspect({ MOCK_USER_A, MOCK_USER_B, MOCK_ADMIN }, false, null, true),
  );
}
