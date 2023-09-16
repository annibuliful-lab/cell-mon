import { MOCK_GRAPHQL_CONTEXT } from '@tadchud-erp/graphql';
import { expectNotFoundError } from '@tadchud-erp/test';
import { nanoid } from 'nanoid';

import { MessageGroupService } from './message-group.service';
import { MessageGroupMemberService } from './message-group-member.service';

describe('Message Group Member Service', () => {
  const groupService = new MessageGroupService({
    ...MOCK_GRAPHQL_CONTEXT,
    accountId: '1',
  });
  const groupMemberService = new MessageGroupMemberService({
    ...MOCK_GRAPHQL_CONTEXT,
    accountId: '1',
  });

  it('creates new group member', async () => {
    const title = nanoid();
    const picture = nanoid();
    const group = await groupService.create({
      title,
      picture,
    });

    const groupMember = await groupMemberService.create({
      messageGroupId: group.id.toString(),
      accountId: '2',
      role: 'ADMIN',
    });

    expect(groupMember.accountId).toEqual(2);
    expect(groupMember.messageGroupId).toEqual(group.id);
    expect(groupMember.role).toEqual('ADMIN');
  });

  it('delete an existing', async () => {
    const title = nanoid();
    const picture = nanoid();
    const group = await groupService.create({
      title,
      picture,
    });

    await groupMemberService.create({
      messageGroupId: group.id.toString(),
      accountId: '2',
      role: 'ADMIN',
    });

    const deletedGroupMember = await groupMemberService.delete({
      accountId: '2',
      messageGroupId: group.id.toString(),
    });

    expectNotFoundError(
      groupMemberService.findById({
        accountId: '2',
        messageGroupId: group.id.toString(),
      })
    );
    expect(deletedGroupMember.accountId).toEqual(2);
    expect(deletedGroupMember.messageGroupId).toEqual(group.id);
    expect(deletedGroupMember.role).toEqual('ADMIN');
  });

  it('gets by account id and message group id', async () => {
    const title = nanoid();
    const picture = nanoid();
    const group = await groupService.create({
      title,
      picture,
    });

    await groupMemberService.create({
      messageGroupId: group.id.toString(),
      accountId: '2',
      role: 'ADMIN',
    });

    const groupMember = await groupMemberService.findById({
      accountId: '2',
      messageGroupId: group.id.toString(),
    });

    expect(groupMember.accountId).toEqual(2);
    expect(groupMember.messageGroupId).toEqual(group.id);
    expect(groupMember.role).toEqual('ADMIN');
  });

  it('gets by message group id', async () => {
    const title = nanoid();
    const picture = nanoid();
    const group = await groupService.create({
      title,
      picture,
    });

    await groupMemberService.create({
      messageGroupId: group.id.toString(),
      accountId: '2',
      role: 'ADMIN',
    });

    const groupMembers = await groupMemberService.findMany({
      messageGroupId: group.id.toString(),
    });

    const groupMember = groupMembers[0];
    expect(groupMembers).toHaveLength(2);
    expect(groupMember.accountId).toEqual(2);
    expect(groupMember.messageGroupId).toEqual(group.id);
    expect(groupMember.role).toEqual('ADMIN');
  });

  it('gets by search', async () => {
    const title = nanoid();
    const picture = nanoid();
    const group = await groupService.create({
      title,
      picture,
    });

    await groupMemberService.create({
      messageGroupId: group.id.toString(),
      accountId: '2',
      role: 'ADMIN',
    });

    const groupMembers = await groupMemberService.findMany({
      messageGroupId: group.id.toString(),
      search: 'admin',
    });

    const groupMember = groupMembers[0];
    expect(groupMembers).toHaveLength(1);
    expect(groupMember.accountId).toEqual(2);
    expect(groupMember.messageGroupId).toEqual(group.id);
    expect(groupMember.role).toEqual('ADMIN');
  });
});
