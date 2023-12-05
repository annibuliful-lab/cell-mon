import { PrimaryRepository } from '@cell-mon/db';
import {
  ForbiddenError,
  GraphqlContext,
  GraphqlError,
  NotfoundResource,
} from '@cell-mon/graphql';
import { Expression, SqlBool } from 'kysely';
import { uniq } from 'lodash';
import { v4 } from 'uuid';

import {
  CellularTechnology,
  MutationCreatePhoneTargetLocationArgs,
  MutationUpdatePhoneTargetLocationArgs,
  PhoneTargetLocation,
  QueryGetPhoneTargeLocationsByPhoneTargetIdArgs,
} from '../../codegen-generated';
type StringOrNull = string | null;

export type PhoneTargetLocationSelection = {
  phoneTargetLocationId: string;
  phoneTargetLocationMetadata: unknown;
  phoneTargetId: string;
  phoneTargetLocationSourceDateTime: Date;
  phoneNetworkMcc: string;
  phoneNetworkMnc: string;
  phoneNetworkOperator: string;
  phoneNetworkCountry: string;
  phoneNetworkCode: string;
  phoneCellInfoCid: StringOrNull;
  phoneCellInfoLac: StringOrNull;
  phoneCellInfoType: CellularTechnology;
  status: string;
  phoneGeoLocations: {
    id: string;
    latitude: string;
    longtitude: string;
    source: string;
  }[];
};
export class PhoneTargetLocationService extends PrimaryRepository<
  never,
  GraphqlContext
> {
  private mapPhoneTargetLocation(
    phoneTargetLocation: PhoneTargetLocationSelection,
  ) {
    return {
      status: phoneTargetLocation.status,
      id: phoneTargetLocation.phoneTargetLocationId,
      phoneTargetId: phoneTargetLocation.phoneTargetId,
      metadata: phoneTargetLocation.phoneTargetLocationMetadata,
      sourceDateTime: phoneTargetLocation.phoneTargetLocationSourceDateTime,
      network: {
        phoneTargetLocationId: phoneTargetLocation.phoneTargetLocationId,
        mcc: phoneTargetLocation.phoneNetworkMcc,
        mnc: phoneTargetLocation.phoneNetworkMnc,
        operator: phoneTargetLocation.phoneNetworkOperator,
        code: phoneTargetLocation.phoneNetworkCode,
        country: phoneTargetLocation.phoneNetworkCountry,
      },
      cellInfo: {
        phoneTargetLocationId: phoneTargetLocation.phoneTargetLocationId,
        type: phoneTargetLocation.phoneCellInfoType as CellularTechnology,
        cid: phoneTargetLocation.phoneCellInfoCid as string,
        lac: phoneTargetLocation.phoneCellInfoLac as string,
      },
      geoLocations: phoneTargetLocation.phoneGeoLocations.map((location) => ({
        id: location.id,
        phoneTargetLocationId: phoneTargetLocation.phoneTargetLocationId,
        source: location.source,
        latitude: Number(location.latitude),
        longtitude: Number(location.longtitude),
      })),
    } as PhoneTargetLocation;
  }

  private async verifyPhoneTargetId(id: string) {
    const phoneTarget = await this.db
      .selectFrom('phone_target')
      .innerJoin('target', 'target.id', 'phone_target.targetId')
      .select(['target.workspaceId as workspaceId', 'phone_target.id as id'])
      .where('phone_target.id', '=', id)
      .executeTakeFirst();

    if (!phoneTarget) {
      throw new NotfoundResource(['id']);
    }

    if (phoneTarget.workspaceId !== this.context.workspaceId) {
      throw new ForbiddenError('You are allow to this phone target');
    }
  }

  async update({
    network,
    cellInfo,
    geoLocations,
    hrlReferenceId,
    id,
    status,
  }: MutationUpdatePhoneTargetLocationArgs): Promise<PhoneTargetLocation> {
    const phoneTargetLocation = await this.db
      .selectFrom('phone_target_location')
      .select(['phone_target_location.id as id'])
      .where('id', '=', id)
      .executeTakeFirst();

    if (!phoneTargetLocation) {
      throw new NotfoundResource(['id']);
    }

    return this.db
      .transaction()
      .setIsolationLevel('read committed')
      .execute(async (tx) => {
        const updatedPhoneTargetLocation = await tx
          .updateTable('phone_target_location')
          .set({
            hrlReferenceId,
            status,
          })
          .where('id', '=', id)
          .returningAll()
          .executeTakeFirst();

        let updatePhoneNetwork:
          | {
              phoneTargetLocationId: string;
              code: string;
              country: string;
              operator: string;
              mnc: string;
              mcc: string;
            }
          | undefined;

        if (network) {
          await tx
            .deleteFrom('phone_network')
            .where('phoneTargetLocationId', '=', id)
            .executeTakeFirst();

          updatePhoneNetwork = await tx
            .insertInto('phone_network')
            .values({
              phoneTargetLocationId: id,
              operator: network.operator,
              mcc: network.mcc,
              mnc: network.mnc,
              code: network.code,
              country: network.country,
            })
            .returningAll()
            .executeTakeFirst();
        }

        let createdGeoLocations: {
          id: string;
          phoneTargetLocationId: string;
          latitude: string;
          longtitude: string;
          source: string;
        }[] = [];

        if (geoLocations) {
          await tx
            .deleteFrom('phone_geo_location')
            .where('phoneTargetLocationId', '=', id)
            .executeTakeFirst();

          createdGeoLocations = await tx
            .insertInto('phone_geo_location')
            .values(
              geoLocations.map((location) => ({
                id: v4(),
                phoneTargetLocationId: id,
                latitude: location.latitude.toString(),
                longtitude: location.longtitude.toString(),
                source: location.source,
              })),
            )
            .returningAll()
            .execute();
        }

        let updatedCellInfo:
          | {
              phoneTargetLocationId: string;
              type: CellularTechnology;
              lac: string;
              cid: string;
              range: string;
            }
          | undefined;

        if (cellInfo) {
          await tx
            .deleteFrom('phone_cell_info')
            .where('phoneTargetLocationId', '=', id)
            .executeTakeFirst();

          updatedCellInfo = (await tx
            .insertInto('phone_cell_info')
            .values({
              phoneTargetLocationId: id,
              type: cellInfo.type,
              lac: cellInfo.lac,
              cid: cellInfo.cid,
              range: cellInfo.range,
            })
            .returningAll()
            .executeTakeFirst()) as never;
        }

        if (!updatedPhoneTargetLocation) {
          throw new GraphqlError('Service unavailable');
        }

        return {
          id: updatedPhoneTargetLocation.id,
          phoneTargetId: updatedPhoneTargetLocation.phoneTargetId,
          metadata: updatedPhoneTargetLocation.metadata,
          sourceDateTime: updatedPhoneTargetLocation.sourceDateTime,
          network: updatePhoneNetwork,
          cellInfo: updatedCellInfo,
          geoLocations: createdGeoLocations.map((location) => ({
            ...location,
            latitude: Number(location.latitude),
            longtitude: Number(location.longtitude),
          })),
          status: updatedPhoneTargetLocation.status,
        } as PhoneTargetLocation;
      });
  }

  async create({
    phoneTargetLocation,
    network,
    cellInfo,
    geoLocations,
    hrlReferenceId,
  }: MutationCreatePhoneTargetLocationArgs): Promise<PhoneTargetLocation> {
    await this.verifyPhoneTargetId(phoneTargetLocation.phoneTargetId);

    return this.db
      .transaction()
      .setIsolationLevel('read uncommitted')
      .execute(async (tx) => {
        const createdPhoneTargetLocation = await tx
          .insertInto('phone_target_location')
          .values({
            id: v4(),
            phoneTargetId: phoneTargetLocation.phoneTargetId,
            metadata: phoneTargetLocation.metadata,
            sourceDateTime: phoneTargetLocation.sourceDateTime,
            createdBy: this.context.accountId,
            hrlReferenceId,
          })
          .returningAll()
          .executeTakeFirst();

        if (!createdPhoneTargetLocation) {
          throw new GraphqlError('Service unavailable');
        }

        let createdNetwork:
          | {
              phoneTargetLocationId: string;
              code: string;
              country: string;
              operator: string;
              mnc: string;
              mcc: string;
            }
          | undefined;

        if (network) {
          createdNetwork = await tx
            .insertInto('phone_network')
            .values({
              phoneTargetLocationId: createdPhoneTargetLocation.id,
              operator: network.operator,
              mcc: network.mcc,
              mnc: network.mnc,
              code: network.code,
              country: network.country,
            })
            .returningAll()
            .executeTakeFirst();
        }
        let createdCellInfo:
          | {
              phoneTargetLocationId: string;
              type: CellularTechnology;
              lac: string;
              cid: string;
              range: string;
            }
          | undefined;

        if (cellInfo) {
          createdCellInfo = (await tx
            .insertInto('phone_cell_info')
            .values({
              phoneTargetLocationId: createdPhoneTargetLocation.id,
              type: cellInfo.type as never,
              lac: cellInfo.lac,
              cid: cellInfo.cid,
              range: cellInfo.range,
            })
            .returningAll()
            .executeTakeFirst()) as never;
        }

        let createdGeoLocations: {
          id: string;
          phoneTargetLocationId: string;
          latitude: string;
          longtitude: string;
          source: string;
        }[] = [];

        if (geoLocations) {
          createdGeoLocations = await tx
            .insertInto('phone_geo_location')
            .values(
              geoLocations.map((location) => ({
                id: v4(),
                phoneTargetLocationId: createdPhoneTargetLocation.id,
                latitude: location.latitude.toString(),
                longtitude: location.longtitude.toString(),
                source: location.source,
              })),
            )
            .returningAll()
            .execute();
        }

        return {
          id: createdPhoneTargetLocation.id,
          phoneTargetId: createdPhoneTargetLocation.phoneTargetId,
          metadata: createdPhoneTargetLocation.metadata,
          sourceDateTime: createdPhoneTargetLocation.sourceDateTime,
          network: createdNetwork,
          cellInfo: createdCellInfo,
          geoLocations: createdGeoLocations.map((location) => ({
            ...location,
            latitude: Number(location.latitude),
            longtitude: Number(location.longtitude),
          })),
          status: createdPhoneTargetLocation.status,
        } as PhoneTargetLocation;
      });
  }

  private baseSelectQuery() {
    return this.db
      .selectFrom('phone_target_location')
      .innerJoin(
        'phone_network',
        'phone_network.phoneTargetLocationId',
        'phone_target_location.id',
      )
      .innerJoin(
        'phone_cell_info',
        'phone_cell_info.phoneTargetLocationId',
        'phone_target_location.id',
      )
      .select([
        'phone_target_location.id as phoneTargetLocationId',
        'phone_target_location.metadata as phoneTargetLocationMetadata',
        'phone_target_location.phoneTargetId as phoneTargetId',
        'phone_target_location.sourceDateTime as phoneTargetLocationSourceDateTime',
        'phone_network.code as phoneNetworkCode',
        'phone_network.mcc as phoneNetworkMcc',
        'phone_network.mnc as phoneNetworkMnc',
        'phone_network.operator as phoneNetworkOperator',
        'phone_cell_info.cid as phoneCellInfoCid',
        'phone_cell_info.lac as phoneCellInfoLac',
        'phone_cell_info.type as phoneCellInfoType',
        'phone_network.country as phoneNetworkCountry',
        'phone_network.code as phoneNetworkCode',
        'phone_target_location.status as status',
        'phone_target_location.hrlReferenceId as hrlReferenceId',
      ]);
  }

  async findById(id: string): Promise<PhoneTargetLocation> {
    const phoneTargetLocationForChecking = await this.db
      .selectFrom('phone_target_location')
      .select(['phoneTargetId'])
      .where('id', '=', id)
      .executeTakeFirst();

    if (!phoneTargetLocationForChecking) {
      throw new NotfoundResource(['id']);
    }

    await this.verifyPhoneTargetId(
      phoneTargetLocationForChecking.phoneTargetId,
    );

    const phoneTargetLocation = await this.baseSelectQuery()
      .where('phone_target_location.id', '=', id)
      .executeTakeFirst();

    if (!phoneTargetLocation) {
      throw new NotfoundResource(['id']);
    }

    const phoneGeoLocations = await this.db
      .selectFrom('phone_geo_location')
      .select(['id', 'latitude', 'longtitude', 'source'])
      .where(
        'phoneTargetLocationId',
        '=',
        phoneTargetLocation.phoneTargetLocationId,
      )
      .execute();

    return this.mapPhoneTargetLocation({
      ...phoneTargetLocation,
      phoneCellInfoType:
        phoneTargetLocation.phoneCellInfoType as CellularTechnology,
      phoneGeoLocations,
    });
  }

  async findManyByPhoneTargetId(
    filter: QueryGetPhoneTargeLocationsByPhoneTargetIdArgs,
  ): Promise<PhoneTargetLocation[]> {
    await this.verifyPhoneTargetId(filter.phoneTargetId);

    const phoneTargetLocations = await this.baseSelectQuery()
      .where((qb) => {
        const exprs: Expression<SqlBool>[] = [
          qb('phoneTargetId', '=', filter.phoneTargetId),
        ];

        if (filter.startDate) {
          exprs.push(qb('sourceDateTime', '>=', filter.startDate));
        }

        if (filter.endDate) {
          exprs.push(qb('sourceDateTime', '<=', filter.endDate));
        }
        return qb.and(exprs);
      })
      .limit(filter.pagination?.limit ?? this.defaultLimit)
      .offset(filter.pagination?.offset ?? this.defaultOffset)
      .execute();

    if (phoneTargetLocations.length === 0) {
      return [];
    }

    const phoneGeoLocations = await this.db
      .selectFrom('phone_geo_location')
      .select([
        'id',
        'latitude',
        'longtitude',
        'source',
        'phoneTargetLocationId',
      ])
      .where(
        'phoneTargetLocationId',
        'in',
        uniq(
          phoneTargetLocations.map(
            (location) => location.phoneTargetLocationId,
          ),
        ),
      )
      .execute();

    return phoneTargetLocations.map((phoneTargetLocation) => {
      const geoLocations = phoneGeoLocations.filter(
        (location) =>
          location.phoneTargetLocationId ===
          phoneTargetLocation.phoneTargetLocationId,
      );

      return this.mapPhoneTargetLocation({
        ...phoneTargetLocation,
        phoneCellInfoType:
          phoneTargetLocation.phoneCellInfoType as CellularTechnology,
        phoneGeoLocations: geoLocations,
      });
    });
  }
}
