import { MOCK_GRAPHQL_CONTEXT } from '@tadchud-erp/graphql';
import {
  Client,
  expectForbiddenError,
  expectNotFoundError,
  getUserBClient,
  getUserClient,
} from '@tadchud-erp/test';
import { nanoid } from 'nanoid';

import { MessageGroupService } from './message-group.service';

describe('Message Group Service', () => {
  const service = new MessageGroupService({
    ...MOCK_GRAPHQL_CONTEXT,
    accountId: '1',
  });

  it('creates new', async () => {
    const title = nanoid();
    const picture = nanoid();
    const group = await service.create({
      title,
      picture,
    });
    expect(group.title).toEqual(title);
    expect(group.picture).toEqual(picture);
  });

  it('updates an existing', async () => {
    const title = nanoid();
    const picture = nanoid();
    const group = await service.create({
      title,
      picture,
    });
    const updated = await service.update({
      id: group.id.toString(),
      input: {
        title: `new-${title}`,
        picture: `new-${picture}`,
      },
    });
    expect(updated.updatedAt).not.toEqual(group.updatedAt);
    expect(updated.title).toEqual(`new-${title}`);
    expect(updated.picture).toEqual(`new-${picture}`);
  });

  it('deletes an existing', async () => {
    const title = nanoid();
    const picture = nanoid();
    const group = await service.create({
      title,
      picture,
    });
    const updated = await service.delete(group.id);
    expect(updated.deletedAt).not.toBeNull();
    expectNotFoundError(service.findById(group.id));
  });

  it('gets by id', async () => {
    const group = await service.findById(1);
    expect(group.title).toEqual('groupA');
  });

  it('throws not found error when wrong id', () => {
    expectNotFoundError(service.findById(2));
  });

  it('throws not found error when correct id but wrong account id', () => {
    expectNotFoundError(
      new MessageGroupService({
        ...MOCK_GRAPHQL_CONTEXT,
        accountId: '2',
      }).findById(1)
    );
  });
});

describe('e2e message group', () => {
  let userBClient: Client;
  let userAClient: Client;

  beforeAll(async () => {
    userBClient = await getUserBClient();
    userAClient = await getUserClient();
  });

  it('throws forbidden error when update with non owner account', async () => {
    const title = nanoid();
    const picture = nanoid();
    const group = await userAClient.mutation({
      createMessageGroup: {
        __scalar: true,
        __args: {
          input: { title, picture },
        },
      },
    });

    expectForbiddenError(
      userBClient.mutation({
        updateMessageGroup: {
          __scalar: true,
          __args: {
            id: group.createMessageGroup.id.toString(),
            input: {
              title: `new-${title}`,
              picture: `new-${picture}`,
            },
          },
        },
      })
    );
  });

  it('throws forbidden error when delete with non owner account', async () => {
    const title = nanoid();
    const picture = nanoid();
    const group = await userAClient.mutation({
      createMessageGroup: {
        __scalar: true,
        __args: {
          input: { title, picture },
        },
      },
    });

    expectForbiddenError(
      userBClient.mutation({
        deleteMessageGroup: {
          __scalar: true,
          __args: {
            id: group.createMessageGroup.id.toString(),
          },
        },
      })
    );
  });
});
