import { getAdminClient } from '@cell-mon/graphql';
import { Client, expectNotFoundError } from '@cell-mon/test';
import { nanoid } from 'nanoid';
import { v4 } from 'uuid';

describe('PhoneMetadata', () => {
  let client: Client;

  beforeEach(async () => {
    client = await getAdminClient();
  });

  it('creates new', async () => {
    const imsi = nanoid();
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
    const imsi = nanoid();
    const msisdn = nanoid();
    const phone = await client.mutation({
      createPhoneMetadata: {
        __scalar: true,
        __args: {
          imsi: nanoid(),
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
      phone.createPhoneMetadata.id
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
      })
    );
  });

  it('gets by id', async () => {
    const imsi = nanoid();
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
      })
    );
  });
});
