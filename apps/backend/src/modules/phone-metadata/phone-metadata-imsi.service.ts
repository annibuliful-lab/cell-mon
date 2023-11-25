import { PrimaryRepository } from '@cell-mon/db';
import {
  BadRequest,
  GraphqlContext,
  InternalGraphqlError,
  mapDataloaderRecord,
} from '@cell-mon/graphql';
import { extractMccMncFromImsi } from '@cell-mon/utils';
import DataLoader from 'dataloader';
import { v4 } from 'uuid';

import {
  MutationCreatePhoneMetadataImsiArgs,
  PhoneMetadataImsi,
} from '../../codegen-generated';

export class PhoneMetadataImsiService extends PrimaryRepository<
  'phone_metadata_imsi',
  GraphqlContext,
  PhoneMetadataImsi
> {
  constructor(ctx: GraphqlContext) {
    super(ctx);

    this.tableColumns = ['id', 'imsi', 'mcc', 'mnc', 'operator'];

    this.dataloader = new DataLoader(
      async (ids: readonly string[]) => {
        const phones = await this.findByIds(ids as string[]);

        return mapDataloaderRecord({ data: phones, ids, idField: 'id' });
      },
      { cache: false },
    );
  }

  async findByIds(ids: string[]) {
    return this.db
      .selectFrom('phone_metadata_imsi')
      .select(this.tableColumns)
      .where('id', 'in', ids)
      .execute();
  }

  async create(
    input: MutationCreatePhoneMetadataImsiArgs & { operator: string },
  ): Promise<PhoneMetadataImsi> {
    const imsiInfo = extractMccMncFromImsi(input.imsi);
    if (imsiInfo === null) {
      throw new BadRequest(['imsi'], 'Invalid Imsi number');
    }

    const createdImsi = await this.db
      .insertInto('phone_metadata_imsi')
      .values({
        id: v4(),
        imsi: input.imsi,
        mcc: imsiInfo.mcc,
        mnc: imsiInfo.mnc,
        operator: input.operator,
        createdBy: this.context.accountId,
      })
      .returningAll()
      .executeTakeFirst();

    if (!createdImsi) {
      throw new InternalGraphqlError();
    }

    return {
      id: createdImsi.id,
      imsi: createdImsi.imsi,
      mcc: createdImsi.mcc,
      mnc: createdImsi.mnc,
      operator: createdImsi.operator,
    };
  }
}
