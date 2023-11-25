import {
  Client,
  createClient,
  getAdminApiKeyClient,
  getAdminClient,
} from '@cell-mon/graphql-client';
import { expectForbiddenError, testCreatePhoneTarget } from '@cell-mon/test';
import { config } from 'dotenv';
import { fetch } from 'undici';

import { CellularTechnology } from '../../codegen-generated';

config();

describe('Phone Target Location', () => {
  let client: Client;
  let apiKeyClient: Client;

  beforeAll(async () => {
    client = await getAdminClient();
    apiKeyClient = getAdminApiKeyClient();
  });

  it('throws forbidden error when creates with invalid api key', async () => {
    const phoneTarget = await testCreatePhoneTarget();
    const network = {
      code: '66',
      operator: 'OPERATOR',
      country: 'Thailand',
      mcc: '433',
      mnc: '03',
    };

    const cellInfo = {
      cid: 'CI',
      type: 'GSM' as CellularTechnology,
      lac: 'LAC',
    };

    const geoLocations = [
      {
        source: 'MOCK_SOURCE',
        latitude: 53.471,
        longtitude: 53.472,
      },
    ];

    const apiKeyClient = createClient({
      url: process.env.GRAPHQL_ENDPOINT,
      fetch,
      headers: {
        'x-api-key': 'INVALID_API_KEY',
      },
    });

    expectForbiddenError(
      apiKeyClient.mutation({
        createPhoneTargetLocation: {
          __scalar: true,
          network: {
            __scalar: true,
          },
          cellInfo: {
            __scalar: true,
          },
          geoLocations: {
            __scalar: true,
          },
          __args: {
            phoneTargetLocation: {
              phoneTargetId: phoneTarget.id,
              sourceDateTime: new Date(),
            },
            network,
            cellInfo: {
              ...cellInfo,
              range: '1000m',
            },
            geoLocations,
          },
        },
      }),
    );
  });

  it('creates new with api key', async () => {
    const phoneTarget = await testCreatePhoneTarget();
    const network = {
      code: '66',
      operator: 'OPERATOR',
      country: 'Thailand',
      mcc: '433',
      mnc: '03',
    };

    const cellInfo = {
      cid: 'CI',
      type: 'GSM' as CellularTechnology,
      lac: 'LAC',
    };

    const geoLocations = [
      {
        source: 'MOCK_SOURCE',
        latitude: 53.471,
        longtitude: 53.472,
      },
    ];

    const phoneTargetLocation = (
      await apiKeyClient.mutation({
        createPhoneTargetLocation: {
          __scalar: true,
          network: {
            __scalar: true,
          },
          cellInfo: {
            __scalar: true,
          },
          geoLocations: {
            __scalar: true,
          },
          __args: {
            phoneTargetLocation: {
              phoneTargetId: phoneTarget.id,
              sourceDateTime: new Date(),
            },
            network,
            cellInfo: {
              ...cellInfo,
              range: '1000m',
            },
            geoLocations,
          },
        },
      })
    ).createPhoneTargetLocation;

    const geoLocation = phoneTargetLocation.geoLocations[0];
    expect(phoneTargetLocation.phoneTargetId).toEqual(phoneTarget.id);
    expect(phoneTargetLocation.network).toEqual(
      expect.objectContaining(network),
    );
    expect(phoneTargetLocation.cellInfo).toEqual(
      expect.objectContaining(cellInfo),
    );
    expect(geoLocation.phoneTargetLocationId).toEqual(phoneTargetLocation.id);
    expect(geoLocation.latitude).toEqual(geoLocations[0].latitude);
    expect(geoLocation.source).toEqual(geoLocations[0].source);
  });

  it('creates new', async () => {
    const phoneTarget = await testCreatePhoneTarget();
    const network = {
      code: '66',
      operator: 'OPERATOR',
      country: 'Thailand',
      mcc: '433',
      mnc: '03',
    };

    const cellInfo = {
      cid: 'CI',
      type: 'GSM' as CellularTechnology,
      lac: 'LAC',
    };

    const geoLocations = [
      {
        source: 'MOCK_SOURCE',
        latitude: 53.471,
        longtitude: 53.472,
      },
    ];

    const phoneTargetLocation = (
      await apiKeyClient.mutation({
        createPhoneTargetLocation: {
          __scalar: true,
          network: {
            __scalar: true,
          },
          cellInfo: {
            __scalar: true,
          },
          geoLocations: {
            __scalar: true,
          },
          __args: {
            phoneTargetLocation: {
              phoneTargetId: phoneTarget.id,
              sourceDateTime: new Date(),
            },
            network,
            cellInfo: {
              ...cellInfo,
              range: '1000m',
            },
            geoLocations,
          },
        },
      })
    ).createPhoneTargetLocation;

    const geoLocation = phoneTargetLocation.geoLocations[0];
    expect(phoneTargetLocation.phoneTargetId).toEqual(phoneTarget.id);
    expect(phoneTargetLocation.network).toEqual(
      expect.objectContaining(network),
    );
    expect(phoneTargetLocation.cellInfo).toEqual(
      expect.objectContaining(cellInfo),
    );
    expect(geoLocation.phoneTargetLocationId).toEqual(phoneTargetLocation.id);
    expect(geoLocation.latitude).toEqual(geoLocations[0].latitude);
    expect(geoLocation.source).toEqual(geoLocations[0].source);
  });

  it('gets by id', async () => {
    const phoneTarget = await testCreatePhoneTarget();
    const network = {
      code: '66',
      operator: 'OPERATOR',
      country: 'Thailand',
      mcc: '433',
      mnc: '03',
    };

    const cellInfo = {
      cid: 'CID',
      type: 'GSM' as CellularTechnology,
      lac: 'LAC',
    };

    const geoLocations = [
      {
        source: 'MOCK_SOURCE',
        latitude: 53.471,
        longtitude: 53.472,
      },
    ];

    const createdPhoneTargetLocation = (
      await apiKeyClient.mutation({
        createPhoneTargetLocation: {
          __scalar: true,
          network: {
            __scalar: true,
          },
          cellInfo: {
            __scalar: true,
          },
          geoLocations: {
            __scalar: true,
          },
          __args: {
            phoneTargetLocation: {
              phoneTargetId: phoneTarget.id,
              sourceDateTime: new Date(),
            },
            network,
            cellInfo: {
              ...cellInfo,
              range: '1000m',
            },
            geoLocations,
          },
        },
      })
    ).createPhoneTargetLocation;

    const phoneTargetLocation = (
      await client.query({
        getPhoneTargetLocationById: {
          __scalar: true,
          network: {
            __scalar: true,
          },
          cellInfo: {
            __scalar: true,
          },
          geoLocations: {
            __scalar: true,
          },
          __args: {
            id: createdPhoneTargetLocation.id,
          },
        },
      })
    ).getPhoneTargetLocationById;

    const geoLocation = phoneTargetLocation.geoLocations[0];
    expect(phoneTargetLocation.phoneTargetId).toEqual(phoneTarget.id);
    expect(phoneTargetLocation.network).toEqual(
      expect.objectContaining(network),
    );
    expect(phoneTargetLocation.cellInfo).toEqual(
      expect.objectContaining(cellInfo),
    );
    expect(geoLocation.phoneTargetLocationId).toEqual(phoneTargetLocation.id);
    expect(geoLocation.latitude).toEqual(geoLocations[0].latitude);
    expect(geoLocation.source).toEqual(geoLocations[0].source);
  });

  it('gets by target id', async () => {
    const phoneTarget = await testCreatePhoneTarget();
    const network = {
      code: '66',
      operator: 'OPERATOR',
      country: 'Thailand',
      mcc: '433',
      mnc: '03',
    };

    const cellInfo = {
      cid: 'CID',
      type: 'GSM' as CellularTechnology,
      lac: 'LAC',
    };

    const geoLocations = [
      {
        source: 'MOCK_SOURCE',
        latitude: 53.471,
        longtitude: 53.472,
      },
    ];

    const createdPhoneTargetLocation = (
      await apiKeyClient.mutation({
        createPhoneTargetLocation: {
          __scalar: true,
          network: {
            __scalar: true,
          },
          cellInfo: {
            __scalar: true,
          },
          geoLocations: {
            __scalar: true,
          },
          __args: {
            phoneTargetLocation: {
              phoneTargetId: phoneTarget.id,
              sourceDateTime: new Date(),
            },
            network,
            cellInfo: {
              ...cellInfo,
              range: '1000m',
            },
            geoLocations,
          },
        },
      })
    ).createPhoneTargetLocation;

    const phoneTargetLocations = (
      await client.query({
        getPhoneTargeLocationsByPhoneTargetId: {
          __scalar: true,
          network: {
            __scalar: true,
          },
          cellInfo: {
            __scalar: true,
          },
          geoLocations: {
            __scalar: true,
          },
          __args: {
            phoneTargetId: createdPhoneTargetLocation.phoneTargetId,
          },
        },
      })
    ).getPhoneTargeLocationsByPhoneTargetId;

    const phoneTargetLocation = phoneTargetLocations[0];
    expect(phoneTargetLocations).toHaveLength(1);
    const geoLocation = phoneTargetLocation.geoLocations[0];
    expect(phoneTargetLocation.phoneTargetId).toEqual(phoneTarget.id);
    expect(phoneTargetLocation.network).toEqual(
      expect.objectContaining(network),
    );
    expect(phoneTargetLocation.cellInfo).toEqual(
      expect.objectContaining(cellInfo),
    );
    expect(geoLocation.phoneTargetLocationId).toEqual(phoneTargetLocation.id);
    expect(geoLocation.latitude).toEqual(geoLocations[0].latitude);
    expect(geoLocation.source).toEqual(geoLocations[0].source);
  });
});
