import { PrimaryRepository } from '@cell-mon/db';
import {
  GraphqlContext,
  mapDataloaderRecord,
  NotfoundResource,
} from '@cell-mon/graphql';
import DataLoader from 'dataloader';
import { Expression, SqlBool } from 'kysely';
import { v4 } from 'uuid';

import {
  MutationCreatePhoneMetadataArgs,
  MutationUpdatePhoneMetadataArgs,
  PhoneMetadata,
  QueryGetPhonesArgs,
} from '../../codegen-generated';

export class PhoneMetadataService extends PrimaryRepository<
  'phone_metadata',
  GraphqlContext,
  PhoneMetadata
> {
  constructor(ctx: GraphqlContext) {
    super(ctx);
    this.dbColumns = ['id', 'imsi', 'msisdn'];

    this.dataloader = new DataLoader(
      async (ids: readonly string[]) => {
        const phones = await this.findByIds(ids as string[]);

        return mapDataloaderRecord({ data: phones, ids, idField: 'id' });
      },
      { cache: false },
    );
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

  async findByIds(ids: string[]) {
    return this.db
      .selectFrom('phone_metadata')
      .select(['id', 'imsi', 'msisdn'])
      .where('id', 'in', ids)
      .execute();
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
