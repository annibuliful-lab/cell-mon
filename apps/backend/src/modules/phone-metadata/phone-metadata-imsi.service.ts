import { PrimaryRepository } from '@cell-mon/db';
import {
  BadRequest,
  GraphqlContext,
  InternalGraphqlError,
} from '@cell-mon/graphql';
import { extractMccMncFromImsi } from '@cell-mon/utils';
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
