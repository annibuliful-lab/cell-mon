import { PrimaryRepository } from '@cell-mon/db';
import { GraphqlContext, NotfoundResource } from '@cell-mon/graphql';
import { Expression, SqlBool } from 'kysely';
import { v4 } from 'uuid';

import {
  MutationCreatePhoneMetadataArgs,
  MutationUpdatePhoneMetadataArgs,
  QueryGetPhonesArgs,
} from '../../codegen-generated';

export class PhoneMetadataService extends PrimaryRepository<
  'phone_metadata',
  GraphqlContext
> {
  constructor(ctx: GraphqlContext) {
    super(ctx);
    this.dbColumns = ['id', 'imsi', 'msisdn'];
  }

  create(input: MutationCreatePhoneMetadataArgs) {
    return this.db
      .insertInto('phone_metadata')
      .values({
        id: v4(),
        imsi: input.imsi,
        msisdn: input.msisdn,
        createdBy: this.context.accountId,
      })
      .returningAll()
      .executeTakeFirst();
  }

  async update(input: MutationUpdatePhoneMetadataArgs) {
    const phone = await this.db
      .updateTable('phone_metadata')
      .set({
        imsi: input.imsi,
        msisdn: input.msisdn,
        updatedBy: this.context.accountId,
      })
      .where('id', '=', input.id)
      .returningAll()
      .executeTakeFirst();

    if (!phone) {
      throw new NotfoundResource(['id'], 'Phone metadata');
    }

    return phone;
  }

  async findById(id: string) {
    const phone = await this.db
      .selectFrom('phone_metadata')
      .select(['id', 'imsi', 'msisdn'])
      .where('id', '=', id)
      .executeTakeFirst();

    if (!phone) {
      throw new NotfoundResource(['id'], 'Phone metadata');
    }

    return phone;
  }

  findMany(filter: QueryGetPhonesArgs) {
    return this.db
      .selectFrom('phone_metadata')
      .select(['id', 'msisdn', 'imsi'])
      .where((qb) => {
        const ors: Expression<SqlBool>[] = [];

        if (filter.imsi) {
          ors.push(qb('imsi', '=', filter.imsi));
        }

        if (filter.msisdn) {
          ors.push(qb('msisdn', '=', filter.msisdn));
        }

        return qb.or(ors);
      })
      .execute();
  }
}
