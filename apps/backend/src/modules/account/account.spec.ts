import { Client, testClient } from '@cell-mon/test';
import { nanoid } from 'nanoid';

describe('Account module', () => {
  let client: Client;
  beforeAll(() => {
    client = testClient;
  });

  it('creates new account', async () => {
    const username = nanoid();
    const email = nanoid();

    const account = (
      await client.mutation({
        createAccount: {
          __scalar: true,
          __args: {
            input: {
              username,
              email,
              password: '12345678',
            },
          },
        },
      })
    ).createAccount;

    expect(account.email).toEqual(email);
    expect(account.username).toEqual(username);
    expect(account.uid).toBeDefined();
  });
});
