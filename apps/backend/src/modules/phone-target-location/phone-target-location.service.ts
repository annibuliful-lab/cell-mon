import { PrimaryRepository } from '@cell-mon/db';
import {
  ForbiddenError,
  GraphqlContext,
  GraphqlError,
  NotfoundResource,
} from '@cell-mon/graphql';
import { uniq } from 'lodash';
import { v4 } from 'uuid';

import {
  CellularTechnology,
  MutationCreatePhoneTargetLocationArgs,
  PhoneTargetLocation,
  QueryGetPhoneTargeLocationsByPhoneTargetIdArgs,
} from '../../codegen-generated';
type StringOrNull = string | null;
export type PhoneTargetLocationSelection = {
  phoneTargetLocationId: string;
  phoneTargetLocationMetadata: unknown;
  phoneTargetId: string;
  phoneTargetLocationSourceDateTime: Date;
  phoneNetworkCode: string;
  phoneNetworkMcc: string;
  phoneNetworkMnc: string;
  phoneNetworkName: string;
  phoneNetworkOperator: string;
  phoneCellInfoCi: StringOrNull;
  phoneCellInfoCid: StringOrNull;
  phoneCellInfoEci: StringOrNull;
  phoneCellInfoEnb: StringOrNull;
  phoneCellInfoLac: StringOrNull;
  phoneCellInfoLcid: StringOrNull;
  phoneCellInfoNci: StringOrNull;
  phoneCellInfoTac: StringOrNull;
  phoneCellInfoType: CellularTechnology;
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
      id: phoneTargetLocation.phoneTargetLocationId,
      phoneTargetId: phoneTargetLocation.phoneTargetId,
      metadata: phoneTargetLocation.phoneTargetLocationMetadata,
      sourceDateTime: phoneTargetLocation.phoneTargetLocationSourceDateTime,
      network: {
        phoneTargetLocationId: phoneTargetLocation.phoneTargetLocationId,
        code: phoneTargetLocation.phoneNetworkCode,
        mcc: phoneTargetLocation.phoneNetworkMcc,
        mnc: phoneTargetLocation.phoneNetworkMnc,
        name: phoneTargetLocation.phoneNetworkName,
        operator: phoneTargetLocation.phoneNetworkOperator,
      },
      cellInfo: {
        phoneTargetLocationId: phoneTargetLocation.phoneTargetLocationId,
        type: phoneTargetLocation.phoneCellInfoType as CellularTechnology,
        ci: phoneTargetLocation.phoneCellInfoCi as string,
        cid: phoneTargetLocation.phoneCellInfoCid as string,
        eci: phoneTargetLocation.phoneCellInfoEci as string,
        enb: phoneTargetLocation.phoneCellInfoEnb as string,
        lac: phoneTargetLocation.phoneCellInfoLac as string,
        lcid: phoneTargetLocation.phoneCellInfoLcid as string,
        nci: phoneTargetLocation.phoneCellInfoNci as string,
        tac: phoneTargetLocation.phoneCellInfoTac as string,
      },
      geoLocations: phoneTargetLocation.phoneGeoLocations.map((location) => ({
        id: location.id,
        phoneTargetLocationId: phoneTargetLocation.phoneTargetLocationId,
        source: location.source,
        latitude: Number(location.latitude),
        longtitude: Number(location.longtitude),
      })),
    };
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

  async create({
    phoneTargetLocation,
    network,
    cellInfo,
    geoLocations,
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
          })
          .returningAll()
          .executeTakeFirst();

        if (!createdPhoneTargetLocation) {
          throw new GraphqlError('Service unavailable');
        }

        const createdNetwork = await tx
          .insertInto('phone_network')
          .values({
            phoneTargetLocationId: createdPhoneTargetLocation.id,
            code: network.code,
            mcc: network.mcc,
            mnc: network.mnc,
            name: network.name,
            operator: network.operator,
          })
          .returningAll()
          .executeTakeFirst();

        const createdCellInfo = await tx
          .insertInto('phone_cell_info')
          .values({
            phoneTargetLocationId: createdPhoneTargetLocation.id,
            type: cellInfo.type,
            ci: cellInfo.ci,
            cid: cellInfo.cid,
            eci: cellInfo.eci,
            enb: cellInfo.enb,
            lac: cellInfo.lac,
            lcid: cellInfo.lcid,
            nci: cellInfo.nci,
            tac: cellInfo.tac,
          })
          .returningAll()
          .executeTakeFirst();

        const createdGeoLocations = await tx
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

        if (
          !createdCellInfo ||
          !createdGeoLocations ||
          !createdNetwork ||
          !createdGeoLocations
        ) {
          throw new GraphqlError('Service unavailable');
        }

        return {
          id: createdPhoneTargetLocation.id,
          phoneTargetId: createdPhoneTargetLocation.phoneTargetId,
          metadata: createdPhoneTargetLocation.metadata,
          sourceDateTime: createdPhoneTargetLocation.sourceDateTime,
          network: createdNetwork,
          cellInfo: {
            phoneTargetLocationId: createdPhoneTargetLocation.id,
            type: createdCellInfo.type as CellularTechnology,
            ci: createdCellInfo.ci as string,
            cid: createdCellInfo.cid as string,
            eci: createdCellInfo.eci as string,
            enb: createdCellInfo.enb as string,
            lac: createdCellInfo.lac as string,
            lcid: createdCellInfo.lcid as string,
            nci: createdCellInfo.nci as string,
            tac: createdCellInfo.tac as string,
          },
          geoLocations: createdGeoLocations.map((location) => ({
            ...location,
            latitude: Number(location.latitude),
            longtitude: Number(location.longtitude),
          })),
        };
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
        'phone_network.name as phoneNetworkName',
        'phone_network.operator as phoneNetworkOperator',
        'phone_cell_info.ci as phoneCellInfoCi',
        'phone_cell_info.cid as phoneCellInfoCid',
        'phone_cell_info.eci as phoneCellInfoEci',
        'phone_cell_info.enb as phoneCellInfoEnb',
        'phone_cell_info.lac as phoneCellInfoLac',
        'phone_cell_info.lcid as phoneCellInfoLcid',
        'phone_cell_info.nci as phoneCellInfoNci',
        'phone_cell_info.tac as phoneCellInfoTac',
        'phone_cell_info.type as phoneCellInfoType',
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
      .where('phoneTargetId', '=', filter.phoneTargetId)
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
