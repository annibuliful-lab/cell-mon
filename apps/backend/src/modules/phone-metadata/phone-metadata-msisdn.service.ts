import { PrimaryRepository } from '@cell-mon/db';
import { GraphqlContext, mapDataloaderRecord } from '@cell-mon/graphql';
import DataLoader from 'dataloader';

import { PhoneMetadataMsisdn } from '../../codegen-generated';

export class PhoneMetadataMsisdnService extends PrimaryRepository<
  'phone_metadata_msisdn',
  GraphqlContext,
  PhoneMetadataMsisdn
> {
  constructor(ctx: GraphqlContext) {
    super(ctx);
    this.tableColumns = ['id', 'msisdn'];

    this.dataloader = new DataLoader(
      async (ids: readonly string[]) => {
        const phones = await this.findByIds(ids as string[]);

        return mapDataloaderRecord({ data: phones, ids, idField: 'id' });
      },
      { cache: false },
    );
  }

  findByIds(ids: string[]) {
    return this.db
      .selectFrom('phone_metadata_msisdn')
      .select(this.tableColumns)
      .where('id', 'in', ids)
      .execute();
  }
}
