import { PrimaryRepository } from '@cell-mon/db';
import {
  GraphqlContext,
  mapDataloaderRecord,
  NotfoundResource,
} from '@cell-mon/graphql';
import DataLoader from 'dataloader';

import { PhoneMetadataMsisdn } from '../../codegen-generated';

export class PhoneMetadataMsisdnService extends PrimaryRepository<
  'phone_metadata_msisdn',
  GraphqlContext,
  PhoneMetadataMsisdn
> {
  constructor(ctx: GraphqlContext) {
    super(ctx);
    this.tableColumns = [
      'phone_metadata_msisdn.id as id',
      'phone_metadata_msisdn.msisdn as msisdn',
    ];

    this.dataloader = new DataLoader(
      async (ids: readonly string[]) => {
        const phones = await this.findByIds(ids as string[]);

        return mapDataloaderRecord({ data: phones, ids, idField: 'id' });
      },
      { cache: false },
    );
  }

  async findFirst({
    phoneTargetId,
  }: {
    phoneTargetId: string;
  }): Promise<PhoneMetadataMsisdn> {
    const phone = await this.db
      .selectFrom('phone_metadata_msisdn')
      .innerJoin(
        'phone_metadata',
        'phone_metadata.msisdnId',
        'phone_metadata_msisdn.id',
      )
      .innerJoin('phone_target', 'phone_target.phoneId', 'phone_metadata.id')
      .select(this.tableColumns)
      .where('phone_target.id', '=', phoneTargetId)
      .executeTakeFirst();

    if (!phone) {
      throw new NotfoundResource(['msisdn']);
    }

    return phone;
  }

  findByIds(ids: string[]): Promise<PhoneMetadataMsisdn[]> {
    return this.db
      .selectFrom('phone_metadata_msisdn')
      .select(this.tableColumns)
      .where('id', 'in', ids)
      .execute();
  }
}
