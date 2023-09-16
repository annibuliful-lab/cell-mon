import { MOCK_GRAPHQL_CONTEXT } from '@tadchud-erp/graphql';
import { expectNotFoundError } from '@tadchud-erp/test';
import { nanoid } from 'nanoid';

import { MessageGroupData } from '../../codegen-generated';
import { MessageGroupService } from './message-group.service';
import { MessageGroupDataService } from './message-group-data.service';

describe('Message Group Data Service', () => {
  const groupService = new MessageGroupService({
    ...MOCK_GRAPHQL_CONTEXT,
    accountId: '1',
  });
  const groupDataService = new MessageGroupDataService({
    ...MOCK_GRAPHQL_CONTEXT,
    accountId: '1',
  });

  it('creates new data', async () => {
    const title = nanoid();
    const picture = nanoid();

    const group = await groupService.create({
      title,
      picture,
    });
    const text = nanoid();
    const media = nanoid();
    const groupData = await groupDataService.create({
      groupId: group.id.toString(),
      message: {
        text,
        media: [{ type: 'png', url: media }],
      },
    });

    const message = groupData.message as MessageGroupData['message'];
    expect(message.text).toEqual(text);
    expect(message.media).toHaveLength(1);
    expect(message.media[0].type).toEqual('png');
    expect(message.media[0].url).toEqual(media);
  });

  it('deletes an existing', async () => {
    const title = nanoid();
    const picture = nanoid();

    const group = await groupService.create({
      title,
      picture,
    });
    const text = nanoid();
    const media = nanoid();
    const groupData = await groupDataService.create({
      groupId: group.id.toString(),
      message: {
        text,
        media: [{ type: 'png', url: media }],
      },
    });

    const deleted = await groupDataService.delete(groupData.id);
    expect(Number(deleted.numUpdatedRows)).toEqual(1);
  });

  it('throws not found error when delete by wrong id', () => {
    expectNotFoundError(groupDataService.delete(Number.MAX_SAFE_INTEGER));
  });
});
