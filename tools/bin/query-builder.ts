import { isNil } from 'lodash';
import { primaryDbClient } from '../../libs/db/src/clients/primary.client';

async function main() {
  const query = primaryDbClient
    .selectFrom('message_group')
    .innerJoin(
      'message_group_member',
      'message_group_member.messageGroupId',
      'message_group.id'
    )
    .select(['message_group.id', 'message_group_member.accountId'])
    .where('message_group_member.messageGroupId', '=', 1)
    .where('deletedAt', 'is', null)
    .where('message_group_member.accountId', '=', 1);
  // .$if(!isNil('null'), (qb) => qb.where('title', 'like', `%aaa%`))

  console.log(await query.execute());
}

main();
