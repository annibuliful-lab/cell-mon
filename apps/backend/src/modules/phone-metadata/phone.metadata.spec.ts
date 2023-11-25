import { Client, getAdminClient } from '@cell-mon/graphql-client';
import { expectBadRequestError, expectNotFoundError } from '@cell-mon/test';
import { generateRandomIMSI } from '@cell-mon/utils';
import { config } from 'dotenv';
import { nanoid } from 'nanoid';
import { v4 } from 'uuid';
config();

describe('PhoneMetadata', () => {
  let client: Client;

  beforeEach(async () => {
    client = await getAdminClient();
  });

  it('creates new imsi', async () => {
    const imsi = generateRandomIMSI();
    const phone = await client.mutation({
      createPhoneMetadataImsi: {
        __scalar: true,
        __args: {
          imsi,
        },
      },
    });

    expect(imsi).toEqual(phone.createPhoneMetadataImsi.imsi);
  });

  it('throws bad request when create imsi with invalid number', async () => {
    const imsi = '123456789';
    expectBadRequestError(
      client.mutation({
        createPhoneMetadataImsi: {
          __scalar: true,
          __args: {
            imsi,
          },
        },
      }),
    );
  });

  it('creates new', async () => {
    const imsi = generateRandomIMSI();
    const msisdn = nanoid();
    const phone = await client.mutation({
      createPhoneMetadata: {
        __scalar: true,
        __args: {
          imsi,
          msisdn,
        },
      },
    });

    expect(imsi).toEqual(phone.createPhoneMetadata.imsi);
    expect(msisdn).toEqual(phone.createPhoneMetadata.msisdn);
  });

  it('updates by id', async () => {
    const imsi = generateRandomIMSI();
    const msisdn = nanoid();
    const phone = await client.mutation({
      createPhoneMetadata: {
        __scalar: true,
        __args: {
          imsi: generateRandomIMSI(),
          msisdn: nanoid(),
        },
      },
    });

    const updated = await client.mutation({
      updatePhoneMetadata: {
        __scalar: true,
        __args: {
          id: phone.createPhoneMetadata.id,
          imsi,
          msisdn,
        },
      },
    });

    expect(updated.updatePhoneMetadata.id).toEqual(
      phone.createPhoneMetadata.id,
    );
    expect(updated.updatePhoneMetadata.imsi).toEqual(imsi);
    expect(updated.updatePhoneMetadata.msisdn).toEqual(msisdn);
  });

  it('throws not found when update by wrong id', () => {
    expectNotFoundError(
      client.mutation({
        updatePhoneMetadata: {
          __scalar: true,
          __args: {
            id: v4(),
            imsi: '',
            msisdn: '',
          },
        },
      }),
    );
  });

  it('gets by id', async () => {
    const imsi = generateRandomIMSI();
    const msisdn = nanoid();
    const created = await client.mutation({
      createPhoneMetadata: {
        __scalar: true,
        __args: {
          imsi,
          msisdn,
        },
      },
    });

    const phone = await client.query({
      getPhoneById: {
        __scalar: true,
        __args: {
          id: created.createPhoneMetadata.id,
        },
      },
    });
    expect(imsi).toEqual(phone.getPhoneById.imsi);
    expect(msisdn).toEqual(phone.getPhoneById.msisdn);
    expect(created.createPhoneMetadata.id).toEqual(phone.getPhoneById.id);
  });

  it('throws not found when get by wrong id', () => {
    expectNotFoundError(
      client.query({
        getPhoneById: {
          __scalar: true,
          __args: {
            id: v4(),
          },
        },
      }),
    );
  });

  it('gets by msisdn', async () => {
    const imsi = generateRandomIMSI();
    const msisdn = nanoid();
    const created = await client.mutation({
      createPhoneMetadata: {
        __scalar: true,
        __args: {
          imsi,
          msisdn,
        },
      },
    });

    const phones = await client.query({
      getPhones: {
        __scalar: true,
        __args: {
          msisdn,
        },
      },
    });

    expect(created.createPhoneMetadata.id).toEqual(phones.getPhones[0].id);
    expect(created.createPhoneMetadata.imsi).toEqual(phones.getPhones[0].imsi);
    expect(created.createPhoneMetadata.msisdn).toEqual(
      phones.getPhones[0].msisdn,
    );
  });

  it('gets by imsi', async () => {
    const imsi = generateRandomIMSI();
    const msisdn = nanoid();
    const created = await client.mutation({
      createPhoneMetadata: {
        __scalar: true,
        __args: {
          imsi,
          msisdn,
        },
      },
    });

    const phones = await client.query({
      getPhones: {
        __scalar: true,
        __args: {
          imsi,
        },
      },
    });

    expect(created.createPhoneMetadata.id).toEqual(phones.getPhones[0].id);
    expect(created.createPhoneMetadata.imsi).toEqual(phones.getPhones[0].imsi);
    expect(created.createPhoneMetadata.msisdn).toEqual(
      phones.getPhones[0].msisdn,
    );
  });
});
