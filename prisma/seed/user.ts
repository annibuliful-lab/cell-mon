import { Prisma } from '@prisma/client';
import { client } from './client';
import util from 'util';
import { hash } from 'argon2';
import { TEST_ADMIN_ID, TEST_USER_B_ID, TEST_USER_ID } from './constants';

export const MOCK_USER_A: Prisma.AccountUncheckedCreateInput = {
  id: 1,
  uid: TEST_USER_ID,
  fullname: 'User_A',
  username: 'MOCK_USER_A',
  email: 'MOCK_USER_A@gmail.com',
  password: '12345678',
  createdBy: 'SYSTEM',
  updatedBy: 'SYSTEM',
};

export const MOCK_USER_B: Prisma.AccountUncheckedCreateInput = {
  id: 3,
  uid: TEST_USER_B_ID,
  fullname: 'User_B',
  username: 'MOCK_USER_B',
  email: 'MOCK_USER_B@gmail.com',
  password: '12345678',
  createdBy: 'SYSTEM',
  updatedBy: 'SYSTEM',
};

export const MOCK_ADMIN: Prisma.AccountUncheckedCreateInput = {
  id: 2,
  uid: TEST_ADMIN_ID,
  fullname: 'Admin',
  username: 'MOCK_ADMIN_A',
  email: 'admin@gmail.com',
  password: '12345678',
  createdBy: 'SYSTEM',
  updatedBy: 'SYSTEM',
};

export async function seedUsers() {
  await client.account.createMany({
    data: [
      {
        id: 1,
        ...MOCK_USER_A,
        password: await hash(MOCK_USER_A.password),
      },
      {
        id: 2,
        ...MOCK_ADMIN,
        password: await hash(MOCK_ADMIN.password),
      },
      {
        id: 3,
        ...MOCK_USER_B,
        password: await hash(MOCK_USER_B.password),
      },
    ],
  });

  console.log(
    'created users',
    util.inspect({ MOCK_USER_A, MOCK_USER_B, MOCK_ADMIN }, false, null, true)
  );
}
