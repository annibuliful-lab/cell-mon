import { PrimaryRepository } from '@cell-mon/db';
import {
  BadRequest,
  GraphqlContext,
  InternalGraphqlError,
  mapDataloaderRecord,
  NotfoundResource,
} from '@cell-mon/graphql';
import { extractMccMncFromImsi } from '@cell-mon/utils';
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
    this.tableColumns = ['phone_metadata.id as id'];

    this.dataloader = new DataLoader(
      async (ids: readonly string[]) => {
        const phones = await this.findByIds(ids as string[]);

        return mapDataloaderRecord({ data: phones, ids, idField: 'id' });
      },
      { cache: false },
    );
  }

  create(input: MutationCreatePhoneMetadataArgs): Promise<PhoneMetadata> {
    return this.db
      .transaction()
      .setIsolationLevel('read uncommitted')
      .execute(async (tx) => {
        let imsiId: string | null = null;
        if (input.imsi) {
          const imsiInfo = extractMccMncFromImsi(input.imsi);
          if (imsiInfo === null) {
            throw new BadRequest(['imsi'], 'Invalid Imsi number');
          }

          const operator = await this.findPhoneOperator(imsiInfo);
          const imsi = await tx
            .insertInto('phone_metadata_imsi')
            .values({
              id: v4(),
              imsi: input.imsi,
              mcc: imsiInfo.mcc,
              mnc: imsiInfo.mnc,
              operator: operator.operator,
              createdBy: this.context.accountId,
            })
            .returningAll()
            .executeTakeFirst();
          imsiId = imsi?.id as string;
        }

        const msisdn = await tx
          .insertInto('phone_metadata_msisdn')
          .values({
            id: v4(),
            msisdn: input.msisdn,
            createdBy: this.context.accountId,
          })
          .returningAll()
          .executeTakeFirst();
        const phone = await tx
          .insertInto('phone_metadata')
          .values({
            id: v4(),
            imsiId,
            msisdnId: msisdn?.id as string,
            createdBy: this.context.accountId,
          })
          .returningAll()
          .executeTakeFirst();

        if (!phone) {
          throw new InternalGraphqlError();
        }

        return {
          id: phone.id,
          imsi: input.imsi,
          msisdn: input.msisdn,
        };
      });
  }

  async update(input: MutationUpdatePhoneMetadataArgs): Promise<PhoneMetadata> {
    const phone = await this.db
      .selectFrom('phone_metadata')
      .select(['id', 'imsiId', 'msisdnId'])
      .where('id', '=', input.id)
      .executeTakeFirst();

    if (!phone) {
      throw new NotfoundResource(['id'], 'Phone metadata');
    }

    if (!input.imsi && !input.msisdn) {
      return {
        id: input.id,
        imsi: input.imsi,
        msisdn: input.msisdn as string,
      };
    }

    await this.db.transaction().execute(async (tx) => {
      let imsiId = phone.imsiId;
      let msisdnId = phone.msisdnId;

      if (input.imsi) {
        const imsi = extractMccMncFromImsi(input.imsi);
        if (!imsi) throw new BadRequest(['imsi']);

        const phoneOperator = await this.findPhoneOperator({
          mcc: imsi.mcc,
          mnc: imsi.mnc,
        });

        imsiId = (
          await tx
            .insertInto('phone_metadata_imsi')
            .values({
              id: v4(),
              imsi: input.imsi,
              mcc: imsi.mcc,
              mnc: imsi.mnc,
              operator: phoneOperator.operator,
              createdBy: this.context.accountId,
            })
            .onConflict((qb) =>
              qb.columns(['imsi', 'mcc', 'mnc', 'operator']).doUpdateSet({
                imsi: input.imsi,
              }),
            )
            .returning(['id'])
            .executeTakeFirst()
        )?.id as string;
      }

      if (input.msisdn) {
        msisdnId = (
          await tx
            .insertInto('phone_metadata_msisdn')
            .values({
              id: v4(),
              msisdn: input.msisdn,
              createdBy: this.context.accountId,
            })
            .onConflict((qb) =>
              qb.columns(['msisdn']).doUpdateSet({
                msisdn: input.msisdn,
              }),
            )
            .returning(['id'])
            .executeTakeFirst()
        )?.id as string;
      }

      await tx
        .updateTable('phone_metadata')
        .set({
          imsiId,
          msisdnId,
        })
        .where('id', '=', input.id)
        .execute();
    });

    return this.baseSelectQuery()
      .where('phone_metadata.id', '=', input.id)
      .executeTakeFirst() as Promise<PhoneMetadata>;
  }

  private baseSelectQuery() {
    return this.db
      .selectFrom('phone_metadata')
      .innerJoin(
        'phone_metadata_imsi as imsi',
        'imsi.id',
        'phone_metadata.imsiId',
      )
      .innerJoin(
        'phone_metadata_msisdn as msisdn',
        'phone_metadata.msisdnId',
        'msisdn.id',
      )
      .select([
        'phone_metadata.id as id',
        'msisdn.msisdn as msisdn',
        'imsi.imsi as imsi',
      ]);
  }

  async findByIds(ids: string[]) {
    return this.baseSelectQuery()
      .where('phone_metadata.id', 'in', ids)
      .execute();
  }

  async findById(id: string) {
    const phone = await this.baseSelectQuery()
      .where('phone_metadata.id', '=', id)
      .executeTakeFirst();

    if (!phone) {
      throw new NotfoundResource(['id'], 'Phone metadata');
    }

    return phone;
  }

  async findPhoneOperator({ mcc, mnc }: { mnc: string; mcc: string }) {
    const phoneOperator = await this.db
      .selectFrom('phone_operator')
      .select(['operator', 'brand', 'country', 'countryCode', 'id'])
      .where('mcc', '=', mcc)
      .where('mnc', '=', mnc)
      .executeTakeFirst();

    if (!phoneOperator) {
      return {
        operator: 'Unknown',
        brand: 'Unknown',
        country: 'Unknown',
        countryCode: 'Unknown',
        technology: [''],
      };
    }

    return phoneOperator;
  }

  findMany(filter: QueryGetPhonesArgs) {
    return this.baseSelectQuery()
      .where((qb) => {
        const ors: Expression<SqlBool>[] = [];

        if (filter.imsi) {
          ors.push(qb('imsi.imsi', '=', filter.imsi));
        }

        if (filter.msisdn) {
          ors.push(qb('msisdn.msisdn', '=', filter.msisdn));
        }

        return qb.or(ors);
      })
      .execute();
  }
}
