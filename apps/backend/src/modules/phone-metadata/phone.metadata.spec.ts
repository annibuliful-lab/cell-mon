import { getAdminClient } from '@cell-mon/graphql';
import { Client } from '@cell-mon/test';
import { nanoid } from 'nanoid';

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
});
